/**
 * Originaly based on ssh2shell package but adjusted for Zen.CI project.
 * credit: https://github.com/cmp-202/ssh2shell
 * Author: http://github.com/Gormartsen
 */
"use strict";

const EventEmitter = require( "events" ).EventEmitter;
const util = require( "util" );
const debugF = require( "debug" );

const bind = function( fn, me ) { return function() { return fn.apply( me, arguments ); }; };

/**
 * Object constructor.
 */
function ZENCIShell( sshObj1 ) {
  EventEmitter.call( this );
  this.sshObj = sshObj1;

  this._loadDefaults();
  this.connection = new require( "ssh2" )();

  // Use a closure to preserve `this`
  var self = this;
  this._notices = [];
  this._buffer = '';
  this.command = '';

  this._timedout = bind( this._timedout, this );
  this._command_timeout = bind( this._command_timeout, this );

  // Attach Events.
  this.on( "connect", function() {
    self.debug.events( "Connected" );
  } );

  this.on( "ready", function() {
    self.debug.events( "Ready" );
  } );

  this.on( "end", function( notices ) {
    self.debug.events( "End" );
  } );

  this.on( "close", function( err ) {
    self.debug.events( "Close" );
    if ( err ) {
      return self.emit( "error", err, "Close" );
    }
  } );

  this.on( "error", function( err, type ) {
    self.debug.events( "Error type: % message: %", type, err );
  } );
}

util.inherits( ZENCIShell, EventEmitter );

ZENCIShell.prototype.sshObj = {};

ZENCIShell.prototype.command = "";

ZENCIShell.prototype._origin_command = "";

ZENCIShell.prototype._origin_command_output = "";

ZENCIShell.prototype._notices = [];

ZENCIShell.prototype._status = -1;

ZENCIShell.prototype._start_time = 0;

ZENCIShell.prototype._total_time = 0;

ZENCIShell.prototype._stream = {};

ZENCIShell.prototype._data = "";

ZENCIShell.prototype._buffer = "";

ZENCIShell.prototype._end = false;

ZENCIShell.prototype.callback = function() { return false; };

ZENCIShell.prototype.debug = {
  events: debugF( "ssh:events" ),
  debug: debugF( "ssh:debug" ),
  raw: debugF( "ssh:raw" )
};

/**
 * Timeout event handler.
 *   Send \C (SIGINT) to stream.
 */
ZENCIShell.prototype._timedout = function() {
  var self = this;
  self.debug.debug( "Timeout triggered on : %s", self.command );
  this._stream.write( "\x03" + " " );
};

/**
 * Keep Alive Timeout event handler.
 *   call _processNextCommand to process next command in queue if exists.
 */
ZENCIShell.prototype._command_timeout = function() {
  var self = this;
  self.debug.events( "_processNextCommand Timeout triggered", self.command );
  this._processNextCommand();
};

/**
 * Process output from stream.
 *   Emit 'commandProcessing' event if command did not finish yet.
 *    - _notice object with last command details.
 */
ZENCIShell.prototype._processData = function( data ) {
  var self = this;
  self.debug.raw( "received : %s", data );

  // Update timeout timer because we received some answer.
  if ( self._idleTimer ) {
    clearTimeout( self._idleTimer );
  }
  self._idleTimer = setTimeout( self._timedout, self._idleTime );

  this._buffer += data;

  // Check for login prompt to know if command finished.
  if ( this.standardPrompt.test( this._buffer ) ) {
    self.debug.raw( "Normal prompt detected" );

    // -13 is a length of hardcoded PS1 + COMMAND_PROMPT.
    if ( this._buffer.length >= 13 ) {
      this._buffer = this._buffer.substr( 0, this._buffer.length - 13 );
    }

    // Cut out cmd line from buffer.
    if ( this.command.length + 2 <= this._buffer.length ) {
      this._buffer =  this._buffer.substr( this.command.length + 2 );
    }

    // Check for status command.
    if ( this.command == 'echo -e "$?"' ) {
      this._status = parseInt( this._buffer );
      this.command = this._origin_command;
      if ( this.command != "" ) {
        var _notice = {
          "command": self.command,
          "status": self._status,
          "time": self._total_time,
          "output": self._origin_command_output
        };
        self._notices.push( _notice );
        this.emit( "commandComplete", _notice );
        self.debug.events( "Command %s finished in %s ms with status %s",
          self.command, self._total_time, self._status );
        this.callback( _notice );
      }
      return this._processNextCommand();
    }

    // If command finished (promt is here) and it is not a echo -e "$?"
    // We need to start echo -e "$?" to get status.
    this._origin_command = this.command;
    this._origin_command_output = this._buffer;
    this._total_time = new Date().getTime() - this._start_time;
    this.command = 'echo -e "$?"';
    this._buffer = "";
    return this._runCommand();

  } else {

    // Command is still running.
    if ( self.command != "" ) {

      // Cut out cmd line from buffer.
      var tmp_buf = self._buffer;
      if ( self.command.length + 2 <= self._buffer.length ) {
        tmp_buf =  self._buffer.substr( self.command.length + 2 );
      }
      var _notice = {
        "command": self.command,
        "status": self._status,
        "time": new Date().getTime() - this._start_time,
        "output": tmp_buf
      };
      this.emit( "commandProcessing", _notice );
      self.debug.events( "Command %s is still runnung for %s ms", _notice.command, _notice.time );
      this.callback( _notice );
    }
  }
};

/**
 * Prepare to start next Command.
 *   Emit 'commandComplete' event if command finished,
 *    - _notice object with last command details.
 *    - sshObj - settings for this class.
 *   or start 'echo -e "$?"' to get latest comman status.
 */
ZENCIShell.prototype._processNextCommand = function() {
  var self = this;
  this._buffer = "";

  if ( this.sshObj.commands.length > 0 ) {
    var nextCommand = this.sshObj.commands.shift();
    if ( !nextCommand.callback ) {
      this.command = nextCommand;
      this.callback = function() { return false;};
    } else {
      this.command = nextCommand.command;
      this.callback = nextCommand.callback;
    }

    this._status = -1;
    this._start_time = new Date().getTime();
    if ( this.command ) {
      return this._runCommand();
    }
  }

  // We get to the end of command list.

  //clear default timeout for command
  if ( this._idleTimer ) {
    clearTimeout( this._idleTimer );
  }

  // Restart Keep Alive command triger if required
  if ( this._idleCommandTimer ) {
    clearTimeout( this._idleCommandTimer );
  }
  if ( this.sshObj.keep_alive ) {
    return this._idleCommandTimer = setTimeout( this._command_timeout, this._idleCommandTime );
  }

  // If this is not keep alive mode, close connection.
  this.end();

};

/**
 * Write command to stream.
 */
ZENCIShell.prototype._runCommand = function() {
  var self = this;
  self.debug.events( "Next command %s ", self.command );
  return this._stream.write( this.command + "\n" );
  return false;
};

/**
 * Add command into commands pull.
 * @return bool TRUE if put in queue, FALSE if connection is not alive
 */
ZENCIShell.prototype.exec = function( command, callback ) {
  var self = this;
  self.debug.events( "Next command %s ", command );

  if ( this.connection._sshstream.writable ) {
    if ( callback ) {
      this.sshObj.commands.push( {
        command: command,
        callback: callback
      } );
    } else {
      this.sshObj.commands.push( command );
    }
    return true;
  }else {
    callback( {
      "command": command,
      "status": 1,
      "time": 0,
      "output": "SSH is already closed"
    } );
  }
  return false;
};

/**
 * Close SSH connection.
 */
ZENCIShell.prototype.end = function() {
  var self = this;
  self.debug.events( "Exit and close connection" );
  self.connection.end();
};

/**
 * Set default values for settings.
 */
ZENCIShell.prototype._loadDefaults = function() {
  var ref;

  if ( !this.sshObj.keep_alive ) {
    this.sshObj.keep_alive = false;
  }

  // Command timeout timer.
  this._idleTime = ( ref = this.sshObj.idleTimeOut ) != null ? ref : 5000;

  // Command queue timer for keep alive mode.
  this._idleCommandTime = ( ref = this.sshObj.idleCommandTimeOut ) != null ? ref : 100;

  return this.standardPrompt = new RegExp( "_zencishell: $" );
};

/**
 * Init ssh2 connection.
 * by using export we setup our own prompt to detect when command finished.
 *   Emit 'onEnd' event if command finished,
 *    - _notices array of notice objects with command status.
 *    - sshObj - settings for this class.
 */
ZENCIShell.prototype.connect = function() {
  var e, error, ref, ref1;
  var self = this;
  if ( this.sshObj.server && this.sshObj.commands ) {

    this.connection.on( "connect", function() {
      self.emit( "connect" );
    } );

    this.connection.on( "ready", function() {
      self.emit( "ready" );

      // We set really wide window to avoid ANSI ESC characters to brake cmd cut.
      return self.connection.shell( { "cols": 1000, "modes": { "ECHO": 53 } },
        function( err, _stream ) {
          self._stream = _stream;
          if ( err ) {
            self.emit( "error", err, "Shell" );
          }
          self._stream.write( "export PS1='zencishell: ';" +
            "export PROMPT_COMMAND='echo -n \"_\"' ; sleep 1\n" );
          self._stream.on( "error", function( err ) {
            return self.emit( "error", err, "Stream" );
          } );

          self._stream.on( "data", function( data ) {
            self._processData( "" + data );
          } );

          self._stream.on( "end", function() {
            if ( self._status == -1 ) {
              var _notice = {
                "command": self.command,
                "status": 1,
                "time": new Date().getTime() - self._start_time,
                "output": self._buffer + "\nRemote connection closed.\n"
              };
              if ( self._notices.length == 0 ) {
                self._notices.push( _notice );
              } else {
                var lastCmd = self._notices[ self._notices.length - 1 ];
                if ( lastCmd.command == _notice.command ) {
                  self._notices[ self._notices.length - 1 ] = _notice;
                } else {
                  self._notices.push( _notice );
                }
              }
              self.emit( "commandComplete", _notice );
              self.debug.events( "Command %s finished in %s ms with status %s",
                _notice.command, _notice.time, _notice._status );
              self.callback( _notice );
              self.emit( "error", new Error( "Connection closed due error" ), "Connection" );
            }
            return self.emit( "end", self._notices );
          } );

          return self._stream.on( "close", function( code, signal ) {
            if ( self._idleTimer ) {
              clearTimeout( self._idleTimer );
            }
            if ( self._idleCommandTimer ) {
              clearTimeout( self._idleCommandTimer );
            }
            return self.connection.end();
          } );
        } );
    } );

    this.connection.on( "error", function( err ) {
      self.emit( "error", err, "Connection" );
    } );

    this.connection.on( "close", function( had_error ) {
      var err = false;
      if ( had_error ) {
        err = new Error( "Connection closed due error" );
      }
      self.emit( "close", err );
    } );

    return this.connection.connect( {
      host: this.sshObj.server.host,
      port: this.sshObj.server.port,
      username: this.sshObj.server.userName,
      password: this.sshObj.server.password,
      agent: this.sshObj.server.agent,
      privateKey: ( ref = this.sshObj.server.privateKey ) != null ? ref : "",
      passphrase: ( ref1 = this.sshObj.server.passPhrase ) != null ? ref1 : "",
      agentForward: this.sshObj.server.agentForward,
    } );

  } else {
    return this.emit( "error", new Error( "Missing connection parameters" ), "Parameters" );
  }
};

module.exports = ZENCIShell;
