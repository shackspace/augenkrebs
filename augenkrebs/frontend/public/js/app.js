(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, mediator, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Application;

})(Chaplin.Application);
});

;require.register("controllers/authentication_controller", function(exports, require, module) {
var AuthenticationController, Controller, Modal, User, mediator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

Controller = require('controllers/base/controller');

User = require('models/user');

Modal = require('views/base/modal');

module.exports = AuthenticationController = (function(_super) {
  __extends(AuthenticationController, _super);

  function AuthenticationController() {
    this.logout = __bind(this.logout, this);
    this.getSession = __bind(this.getSession, this);
    _ref = AuthenticationController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AuthenticationController.prototype.initialize = function() {
    mediator.subscribe('!auth:logout', this.logout);
    return this.publishEvent('!auth:success');
  };

  AuthenticationController.prototype.getSession = function() {
    var _this = this;
    this.publishEvent('!io:emit', 'login', null, function(user) {
      if (user != null) {
        mediator.user = new User(user);
        return _this.publishEvent('!auth:success');
      } else {
        mediator.user = new User();
        _this.view = new LoginView({
          model: mediator.user
        });
        return mediator.user.on('change', function() {
          _this.view.dispose();
          return _this.publishEvent('!io:emit', 'login', mediator.user.toJSON(), function(user) {
            return _this.publishEvent('!auth:success');
          });
        });
      }
    });
    return this.subscribeEvent('!io:disconnect', function() {
      var diag;
      console.log('disconnected');
      diag = new ConnectionErrorDialog();
      diag.container = '#page-container';
      return diag.render();
    });
  };

  AuthenticationController.prototype.logout = function() {
    return this.publishEvent('!io:emit', 'logout', function() {
      console.log('logged out');
      return window.location.reload(true);
    });
  };

  return AuthenticationController;

})(Controller);
});

;require.register("controllers/base/controller", function(exports, require, module) {
var Controller, SiteView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SiteView = require('views/site_view');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller() {
    _ref = Controller.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Controller.prototype.beforeAction = function() {
    return this.reuse('site', SiteView);
  };

  return Controller;

})(Chaplin.Controller);
});

;require.register("controllers/dashboard_controller", function(exports, require, module) {
var Controller, HomeController, IconView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controllers/base/controller');

IconView = require('views/icon_view');

module.exports = HomeController = (function(_super) {
  __extends(HomeController, _super);

  function HomeController() {
    _ref = HomeController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeController.prototype.icon = function() {
    return this.view = new IconView({
      region: 'main'
    });
  };

  return HomeController;

})(Controller);
});

;require.register("controllers/footer_controller", function(exports, require, module) {
var Controller, FooterController, FooterView, mediator, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controllers/base/controller');

mediator = require('mediator');

FooterView = require('views/footer_view');

module.exports = FooterController = (function(_super) {
  __extends(FooterController, _super);

  function FooterController() {
    _ref = FooterController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FooterController.prototype.initialize = function() {
    FooterController.__super__.initialize.apply(this, arguments);
    return this.view = new FooterView();
  };

  return FooterController;

})(Controller);
});

;require.register("controllers/home_controller", function(exports, require, module) {
var AboutView, Controller, ControlsView, Header, HeaderView, HomeController, HomePageView, Playlist, PlaylistView, Status, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('controllers/base/controller');

HomePageView = require('views/home_page_view');

AboutView = require('views/about_view');

ControlsView = require('views/controls_view');

PlaylistView = require('views/playlist_view');

Header = require('models/header');

HeaderView = require('views/header_view');

Status = require('models/status');

Playlist = require('models/playlist').Playlist;

module.exports = HomeController = (function(_super) {
  __extends(HomeController, _super);

  function HomeController() {
    _ref = HomeController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeController.prototype.beforeAction = function() {
    var headerModel;
    HomeController.__super__.beforeAction.apply(this, arguments);
    headerModel = new Header();
    return this.reuse('header', HeaderView, {
      region: 'header',
      model: headerModel
    });
  };

  HomeController.prototype.index = function() {
    var controlsView, playlist, status,
      _this = this;
    status = new Status();
    playlist = new Playlist();
    setInterval(function() {
      status.fetch({
        contentType: 'json',
        error: function() {
          return console.log('nope');
        }
      });
      if (!playlist.suspendUpdate) {
        return playlist.fetch({
          reset: true,
          contentType: 'json',
          error: function() {
            return console.log('nope');
          }
        });
      }
    }, 1000);
    this.view = new HomePageView({
      model: status,
      region: 'main'
    });
    controlsView = new ControlsView({
      model: status,
      region: 'controls'
    });
    this.view.subview('controls', controlsView);
    this.view.subview('playlist', new PlaylistView({
      collection: playlist,
      region: 'playlist'
    }));
    this.listenTo(this.view.subview('playlist'), 'sort-start', function(model) {
      playlist.suspendUpdate = true;
      return $.ajax({
        url: '/api/playlist/' + model.id,
        type: 'DELETE'
      });
    });
    this.listenTo(this.view.subview('playlist'), 'sort-stop', function(model, newIndex) {
      return $.ajax({
        url: '/api/playlist/' + newIndex,
        type: 'PUT',
        data: JSON.stringify({
          url: model.get('url')
        }),
        contentType: 'application/json',
        dataType: 'json',
        complete: function() {
          return playlist.suspendUpdate = false;
        }
      });
    });
    this.listenTo(controlsView, 'open', function(url) {
      console.log('open', url);
      return $.ajax({
        url: '/api/open',
        type: 'POST',
        data: JSON.stringify({
          url: url
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function() {
          return controlsView.clearUrl();
        }
      });
    });
    this.listenTo(controlsView, 'append', function(url) {
      console.log('append', url);
      return $.ajax({
        url: '/api/playlist/',
        type: 'POST',
        data: JSON.stringify({
          url: url
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function() {
          return controlsView.clearUrl();
        }
      });
    });
    this.listenTo(controlsView, 'play', function() {
      console.log('play');
      return $.ajax({
        type: 'GET',
        url: '/api/play'
      });
    });
    this.listenTo(controlsView, 'pause', function() {
      console.log('pause');
      return $.ajax({
        type: 'GET',
        url: '/api/pause'
      });
    });
    this.listenTo(controlsView, 'stop', function() {
      console.log('stop');
      return $.ajax({
        type: 'GET',
        url: '/api/stop'
      });
    });
    this.listenTo(controlsView, 'next', function() {
      return console.log('next');
    });
    this.listenTo(controlsView, 'previous', function() {
      return console.log('previous');
    });
    this.listenTo(controlsView, 'forward', function() {
      return console.log('forward');
    });
    this.listenTo(controlsView, 'fast-forward', function() {
      return console.log('fast-forward');
    });
    this.listenTo(controlsView, 'backward', function() {
      return console.log('backward');
    });
    this.listenTo(controlsView, 'fast-backward', function() {
      return console.log('fast-backward');
    });
    this.listenTo(controlsView, 'mute', function() {
      console.log('mute');
      return status.save({
        muted: +(!status.get('muted'))
      });
    });
    this.listenTo(controlsView, 'seek', function(position) {
      return status.save({
        position: position
      });
    });
    this.listenTo(controlsView, 'volume', function(volume) {
      return status.save({
        volume: volume
      });
    });
    this.listenTo(controlsView, 'subtitles', function(sub) {
      console.log('subtitles', sub);
      return status.save({
        subtitle: sub
      });
    });
    this.listenTo(controlsView, 'subtitle-delay', function(delay) {
      console.log('subtitle-delay', delay);
      return status.save({
        subtitle_delay: delay
      });
    });
    this.listenTo(controlsView, 'audiotrack-list', function(track) {
      console.log('audiotrack', track);
      return status.save({
        audiotrack: track
      });
    });
    return this.listenTo(controlsView, 'audio-delay', function(delay) {
      console.log('audio-delay', delay);
      return status.save({
        audio_delay: delay
      });
    });
  };

  HomeController.prototype.about = function() {
    return this.view = new AboutView({
      region: 'main'
    });
  };

  return HomeController;

})(Controller);
});

;require.register("index.static", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui\"><title>augenkrebs</title><link rel=\"stylesheet\" href=\"/css/app.css\"><script defer src=\"/js/vendor.js\"></script><script defer src=\"/js/app.js\" onload=\"require(&quot;initialize&quot;)\"></script></head><body><div class=\"spinner\"><div class=\"double-bounce1\"></div><div class=\"double-bounce2\"></div></div></body></html>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("initialize", function(exports, require, module) {
var Application, routes;

Application = require('application');

routes = require('routes');

$(function() {
  return new Application({
    title: 'augenkrebs',
    controllerSuffix: '_controller',
    routes: routes
  });
});
});

;require.register("lib/services/service_provider", function(exports, require, module) {
var Chaplin, ServiceProvider, utils;

utils = require('lib/utils');

Chaplin = require('chaplin');

module.exports = ServiceProvider = (function() {
  _(ServiceProvider.prototype).extend(Chaplin.Subscriber);

  ServiceProvider.prototype.loading = false;

  function ServiceProvider() {
    _(this).extend($.Deferred());
    utils.deferMethods({
      deferred: this,
      methods: ['triggerLogin', 'getLoginStatus'],
      onDeferral: this.load
    });
  }

  ServiceProvider.prototype.disposed = false;

  ServiceProvider.prototype.dispose = function() {
    if (this.disposed) {
      return;
    }
    this.unsubscribeAllEvents();
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return ServiceProvider;

})();

/*

  Standard methods and their signatures:

  load: ->
    # Load a script like this:
    utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

  loadHandler: =>
    # Init the library, then resolve
    ServiceProviderLibrary.init(foo: 'bar')
    @resolve()

  isLoaded: ->
    # Return a Boolean
    Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

  # Trigger login popup
  triggerLogin: (loginContext) ->
    callback = _(@loginHandler).bind(this, loginContext)
    ServiceProviderLibrary.login callback

  # Callback for the login popup
  loginHandler: (loginContext, response) =>

    eventPayload = {provider: this, loginContext}
    if response
      # Publish successful login
      mediator.publish 'loginSuccessful', eventPayload

      # Publish the session
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.

    else
      mediator.publish 'loginFail', eventPayload

  getLoginStatus: (callback = @loginStatusHandler, force = false) ->
    ServiceProviderLibrary.getLoginStatus callback, force

  loginStatusHandler: (response) =>
    return unless response
    mediator.publish 'serviceProviderSession',
      provider: this
      userId: response.userId
      accessToken: response.accessToken
      # etc.
*/

});

;require.register("lib/support", function(exports, require, module) {
var Chaplin, support, utils;

Chaplin = require('chaplin');

utils = require('lib/utils');

support = utils.beget(Chaplin.support);

module.exports = support;
});

;require.register("lib/utils", function(exports, require, module) {
var Chaplin, mediator, utils,
  __hasProp = {}.hasOwnProperty;

Chaplin = require('chaplin');

mediator = require('mediator');

utils = Chaplin.utils.beget(Chaplin.utils);

_(utils).extend({
  /*
  Wrap methods so they can be called before a deferred is resolved.
  The actual methods are called once the deferred is resolved.
  
  Parameters:
  
  Expects an options hash with the following properties:
  
  deferred
    The Deferred object to wait for.
  
  methods
    Either:
    - A string with a method name e.g. 'method'
    - An array of strings e.g. ['method1', 'method2']
    - An object with methods e.g. {method: -> alert('resolved!')}
  
  host (optional)
    If you pass an array of strings in the `methods` parameter the methods
    are fetched from this object. Defaults to `deferred`.
  
  target (optional)
    The target object the new wrapper methods are created at.
    Defaults to host if host is given, otherwise it defaults to deferred.
  
  onDeferral (optional)
    An additional callback function which is invoked when the method is called
    and the Deferred isn't resolved yet.
    After the method is registered as a done handler on the Deferred,
    this callback is invoked. This can be used to trigger the resolving
    of the Deferred.
  
  Examples:
  
  deferMethods(deferred: def, methods: 'foo')
    Wrap the method named foo of the given deferred def and
    postpone all calls until the deferred is resolved.
  
  deferMethods(deferred: def, methods: def.specialMethods)
    Read all methods from the hash def.specialMethods and
    create wrapped methods with the same names at def.
  
  deferMethods(
    deferred: def, methods: def.specialMethods, target: def.specialMethods
  )
    Read all methods from the object def.specialMethods and
    create wrapped methods at def.specialMethods,
    overwriting the existing ones.
  
  deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
    Wrap the methods obj.foo and obj.bar so all calls to them are postponed
    until def is resolved. obj.foo and obj.bar are overwritten
    with their wrappers.
  */

  deferMethods: function(options) {
    var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
    deferred = options.deferred;
    methods = options.methods;
    host = options.host || deferred;
    target = options.target || host;
    onDeferral = options.onDeferral;
    methodsHash = {};
    if (typeof methods === 'string') {
      methodsHash[methods] = host[methods];
    } else if (methods.length && methods[0]) {
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        name = methods[_i];
        func = host[name];
        if (typeof func !== 'function') {
          throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
        }
        methodsHash[name] = func;
      }
    } else {
      methodsHash = methods;
    }
    _results = [];
    for (name in methodsHash) {
      if (!__hasProp.call(methodsHash, name)) continue;
      func = methodsHash[name];
      if (typeof func !== 'function') {
        continue;
      }
      _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
    }
    return _results;
  },
  createDeferredFunction: function(deferred, func, context, onDeferral) {
    if (context == null) {
      context = deferred;
    }
    return function() {
      var args;
      args = arguments;
      if (deferred.state() === 'resolved') {
        return func.apply(context, args);
      } else {
        deferred.done(function() {
          return func.apply(context, args);
        });
        if (typeof onDeferral === 'function') {
          return onDeferral.apply(context);
        }
      }
    };
  }
});

module.exports = utils;
});

;require.register("mediator", function(exports, require, module) {
var mediator;

mediator = module.exports = Chaplin.mediator;
});

;require.register("models/base/collection", function(exports, require, module) {
var Collection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Collection;

})(Chaplin.Collection);
});

;require.register("models/base/model", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Chaplin.Model);
});

;require.register("models/header", function(exports, require, module) {
var Header, Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

module.exports = Header = (function(_super) {
  __extends(Header, _super);

  function Header() {
    _ref = Header.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Header.prototype.defaults = {
    items: [
      {
        href: '/admin',
        title: 'Admin'
      }
    ]
  };

  return Header;

})(Model);
});

;require.register("models/playlist", function(exports, require, module) {
var Collection, Model, Playlist, PlaylistItem, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

Collection = require('models/base/collection');

module.exports.PlaylistItem = PlaylistItem = (function(_super) {
  __extends(PlaylistItem, _super);

  function PlaylistItem() {
    _ref = PlaylistItem.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return PlaylistItem;

})(Model);

module.exports.Playlist = Playlist = (function(_super) {
  __extends(Playlist, _super);

  function Playlist() {
    _ref1 = Playlist.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Playlist.prototype.model = PlaylistItem;

  Playlist.prototype.url = '/api/playlist/';

  Playlist.prototype.parse = function(response) {
    var i, item, _i, _len;
    for (i = _i = 0, _len = response.length; _i < _len; i = ++_i) {
      item = response[i];
      item.id = i;
    }
    return response;
  };

  return Playlist;

})(Collection);
});

;require.register("models/status", function(exports, require, module) {
var Model, Status, methodMap, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

methodMap = {
  'read': 'GET',
  'update': 'POST',
  'create': 'POST',
  'patch': 'POST'
};

module.exports = Status = (function(_super) {
  __extends(Status, _super);

  function Status() {
    this.fetch = __bind(this.fetch, this);
    this.save = __bind(this.save, this);
    _ref = Status.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Status.prototype.url = '/api/status';

  Status.prototype.sync = function(method, model, options) {
    var params, type, xhr;
    type = methodMap[method];
    if (type == null) {
      return null;
    }
    params = {
      type: type,
      dataType: 'json',
      url: this.url
    };
    if (type === 'POST') {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }
    xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    return xhr;
  };

  Status.prototype.save = function(fields, options) {
    var _this = this;
    this.writeLock = true;
    return Status.__super__.save.call(this, fields, {
      patch: true,
      complete: function() {
        return _this.writeLock = false;
      }
    });
  };

  Status.prototype.fetch = function(options) {
    if (this.writeLock) {
      return;
    }
    return Status.__super__.fetch.call(this, options);
  };

  Status.prototype.isNew = function() {
    return false;
  };

  return Status;

})(Model);
});

;require.register("models/user", function(exports, require, module) {
var Model, User, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return User;

})(Model);
});

;require.register("routes", function(exports, require, module) {
module.exports = function(match) {
  match('', 'home#index');
  match('about', 'home#about');
  return match('icon', 'dashboard#icon');
};
});

;require.register("views/about_view", function(exports, require, module) {
var AboutView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = AboutView = (function(_super) {
  __extends(AboutView, _super);

  function AboutView() {
    _ref = AboutView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  AboutView.prototype.autoRender = true;

  AboutView.prototype.template = require('views/templates/about');

  AboutView.prototype.className = 'about-page container';

  return AboutView;

})(View);
});

;require.register("views/base/collection_view", function(exports, require, module) {
var CollectionView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = CollectionView = (function(_super) {
  __extends(CollectionView, _super);

  function CollectionView() {
    _ref = CollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

  return CollectionView;

})(Chaplin.CollectionView);
});

;require.register("views/base/modal", function(exports, require, module) {
var Modal, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = Modal = (function(_super) {
  __extends(Modal, _super);

  function Modal() {
    this.render = __bind(this.render, this);
    this.hide = __bind(this.hide, this);
    this.keydown = __bind(this.keydown, this);
    _ref = Modal.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Modal.prototype.className = 'modal fade';

  Modal.prototype.events = {
    'click .save': 'save',
    'click .close,.btn-close': 'hide',
    'hidden': 'hidden',
    'keydown': 'keydown'
  };

  Modal.prototype.keydown = function(event) {
    if (event.keyCode !== 13) {
      return;
    }
    event.preventDefault();
    this.save(event);
    return false;
  };

  Modal.prototype.hide = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    return this.$el.modal('hide');
  };

  Modal.prototype.render = function() {
    Modal.__super__.render.apply(this, arguments);
    this.$el.modal({
      'keyboard': true,
      'backdrop': true
    });
    this.delegateEvents();
    this.$el.modal({
      'show': true
    });
    return this;
  };

  Modal.prototype.hidden = function() {
    this.remove();
    return false;
  };

  return Modal;

})(View);
});

;require.register("views/base/page_view", function(exports, require, module) {
var PageView, View, mediator, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

View = require('views/base/view');

module.exports = PageView = (function(_super) {
  __extends(PageView, _super);

  function PageView() {
    _ref = PageView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PageView.prototype.container = '#page-container';

  PageView.prototype.autoRender = true;

  return PageView;

})(View);
});

;require.register("views/base/view", function(exports, require, module) {
var View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.getTemplateFunction = function() {
    return this.template;
  };

  View.prototype.getTemplateData = function() {
    var data;
    data = View.__super__.getTemplateData.call(this);
    data.moment = moment;
    return data;
  };

  return View;

})(Chaplin.View);
});

;require.register("views/controls_view", function(exports, require, module) {
var ControlsView, View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = ControlsView = (function(_super) {
  __extends(ControlsView, _super);

  function ControlsView() {
    this.changeAudioDelay = __bind(this.changeAudioDelay, this);
    this.changeAudiotrack = __bind(this.changeAudiotrack, this);
    this.changeAudiotrackList = __bind(this.changeAudiotrackList, this);
    this.changeSubtitleDelay = __bind(this.changeSubtitleDelay, this);
    this.changeSubtitle = __bind(this.changeSubtitle, this);
    this.changeSubtitleList = __bind(this.changeSubtitleList, this);
    this.changeMuted = __bind(this.changeMuted, this);
    this.changeVolume = __bind(this.changeVolume, this);
    this.changePosition = __bind(this.changePosition, this);
    this.changeLength = __bind(this.changeLength, this);
    this.changeIsPlaying = __bind(this.changeIsPlaying, this);
    this.render = __bind(this.render, this);
    this.audioDelay = __bind(this.audioDelay, this);
    this.audiotrackList = __bind(this.audiotrackList, this);
    this.subtitleDelay = __bind(this.subtitleDelay, this);
    this.subtitles = __bind(this.subtitles, this);
    this.mute = __bind(this.mute, this);
    this.fastBackward = __bind(this.fastBackward, this);
    this.backward = __bind(this.backward, this);
    this.fastForward = __bind(this.fastForward, this);
    this.forward = __bind(this.forward, this);
    this.previous = __bind(this.previous, this);
    this.next = __bind(this.next, this);
    this.stop = __bind(this.stop, this);
    this.pause = __bind(this.pause, this);
    this.play = __bind(this.play, this);
    this.append = __bind(this.append, this);
    this.open = __bind(this.open, this);
    _ref = ControlsView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ControlsView.prototype.autoRender = true;

  ControlsView.prototype.template = require('views/templates/controls');

  ControlsView.prototype.className = '';

  ControlsView.prototype.events = {
    'submit form': 'open',
    'click .open': 'open',
    'click .append': 'append',
    'click #play': 'play',
    'click #pause': 'pause',
    'click #stop': 'stop',
    'click #next': 'next',
    'click #previous': 'previous',
    'click #forward': 'forward',
    'click #fast-forward': 'fastForward',
    'click #backward': 'backward',
    'click #fast-backward': 'fastBackward',
    'click #muted': 'mute',
    'change #subtitles': 'subtitles',
    'change #audiotrack-list': 'audiotrackList',
    'change #subtitle-delay': 'subtitleDelay',
    'change #audio-delay': 'audioDelay'
  };

  ControlsView.prototype.open = function(event) {
    event.preventDefault();
    return this.trigger('open', this.$('#url').val());
  };

  ControlsView.prototype.append = function(event) {
    event.preventDefault();
    return this.trigger('append', this.$('#url').val());
  };

  ControlsView.prototype.play = function(event) {
    event.preventDefault();
    return this.trigger('play');
  };

  ControlsView.prototype.pause = function(event) {
    event.preventDefault();
    return this.trigger('pause');
  };

  ControlsView.prototype.stop = function(event) {
    event.preventDefault();
    return this.trigger('stop');
  };

  ControlsView.prototype.next = function(event) {
    event.preventDefault();
    return this.trigger('next');
  };

  ControlsView.prototype.previous = function(event) {
    event.preventDefault();
    return this.trigger('previous');
  };

  ControlsView.prototype.forward = function(event) {
    event.preventDefault();
    return this.trigger('forward');
  };

  ControlsView.prototype.fastForward = function(event) {
    event.preventDefault();
    return this.trigger('fast-forward');
  };

  ControlsView.prototype.backward = function(event) {
    event.preventDefault();
    return this.trigger('backward');
  };

  ControlsView.prototype.fastBackward = function(event) {
    event.preventDefault();
    return this.trigger('fast-backward');
  };

  ControlsView.prototype.mute = function(event) {
    event.preventDefault();
    return this.trigger('mute');
  };

  ControlsView.prototype.subtitles = function(event) {
    return this.trigger('subtitles', $('#subtitles option:selected').val());
  };

  ControlsView.prototype.subtitleDelay = function(event) {
    var delay;
    delay = parseFloat(this.$('#subtitle-delay').val());
    if (!isNaN(delay)) {
      return this.trigger('subtitle-delay', delay);
    }
  };

  ControlsView.prototype.audiotrackList = function(event) {
    return this.trigger('audiotrack-list', $('#audiotrack-list option:selected').val());
  };

  ControlsView.prototype.audioDelay = function(event) {
    var delay;
    delay = parseFloat(this.$('#audio-delay').val());
    if (!isNaN(delay)) {
      return this.trigger('audio-delay', delay);
    }
  };

  ControlsView.prototype.render = function() {
    var posSlider, slideEventHandler, volEventHandler, volSlider,
      _this = this;
    ControlsView.__super__.render.apply(this, arguments);
    posSlider = this.$('#position').slider({
      min: 0,
      max: 3600,
      step: 1,
      handle: 'custom',
      enabled: false
    });
    slideEventHandler = function(event) {
      return _this.trigger('seek', event.value);
    };
    posSlider.on('slideStop', slideEventHandler);
    posSlider.on('slide', slideEventHandler);
    volSlider = this.$('#volume').slider({
      min: 0,
      max: 150,
      step: 1
    });
    volEventHandler = function(event) {
      return _this.trigger('volume', event.value);
    };
    volSlider.on('slideStop', volEventHandler);
    return volSlider.on('slide', volEventHandler);
  };

  ControlsView.prototype.clearUrl = function() {
    return this.$('#url').val('');
  };

  ControlsView.prototype.listen = {
    'change:is_playing model': 'changeIsPlaying',
    'change:length model': 'changeLength',
    'change:position model': 'changePosition',
    'change:volume model': 'changeVolume',
    'change:muted model': 'changeMuted',
    'change:subtitle_list model': 'changeSubtitleList',
    'change:subtitle model': 'changeSubtitle',
    'change:subtitle_delay model': 'changeSubtitleDelay',
    'change:audiotrack_list model': 'changeAudiotrackList',
    'change:audiotrack model': 'changeAudiotrack',
    'change:audio_delay model': 'changeAudioDelay'
  };

  ControlsView.prototype.changeIsPlaying = function(model, field) {};

  ControlsView.prototype.changeLength = function(model, length) {
    var slider;
    slider = this.$('#position');
    if (length === -1) {
      return slider.slider('disable');
    } else {
      if (!slider.slider('isEnabled')) {
        slider.slider('enable');
      }
      return slider.slider('setAttribute', 'max', length);
    }
  };

  ControlsView.prototype.changePosition = function(model, pos) {
    var slider;
    if (pos === -1) {
      return;
    }
    slider = this.$('#position');
    return slider.slider('setValue', pos);
  };

  ControlsView.prototype.changeVolume = function(model, vol) {
    var slider;
    slider = this.$('#volume');
    return slider.slider('setValue', vol);
  };

  ControlsView.prototype.changeMuted = function(model, muted) {
    if (muted) {
      $('#muted span').removeClass('glyphicon-volume-up');
      return $('#muted span').addClass('glyphicon-volume-off');
    } else {
      $('#muted span').removeClass('glyphicon-volume-off');
      return $('#muted span').addClass('glyphicon-volume-up');
    }
  };

  ControlsView.prototype.changeSubtitleList = function(model, list) {
    var sub, subtitles, _i, _len, _results;
    subtitles = $('#subtitles');
    subtitles.empty();
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      sub = list[_i];
      _results.push(subtitles.append($('<option>', {
        value: sub,
        text: sub
      })));
    }
    return _results;
  };

  ControlsView.prototype.changeSubtitle = function(model, sub) {
    $('#subtitles option:selected').prop('selected', false);
    return $('#subtitles option[value="' + sub + '"]').prop('selected', true);
  };

  ControlsView.prototype.changeSubtitleDelay = function(model, delay) {
    return $('#subtitle-delay').val(delay);
  };

  ControlsView.prototype.changeAudiotrackList = function(model, list) {
    var audiotracks, track, _i, _len, _results;
    audiotracks = $('#audiotrack-list');
    audiotracks.empty();
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      track = list[_i];
      _results.push(audiotracks.append($('<option>', {
        value: track,
        text: track
      })));
    }
    return _results;
  };

  ControlsView.prototype.changeAudiotrack = function(model, track) {
    $('#audiotrack-list option:selected').prop('selected', false);
    return $('#audiotrack-list option[value="' + track + '"]').prop('selected', true);
  };

  ControlsView.prototype.changeAudioDelay = function(model, delay) {
    return $('#audio-delay').val(delay);
  };

  return ControlsView;

})(View);
});

;require.register("views/footer_view", function(exports, require, module) {
var FooterView, View, mediator, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

View = require('views/base/view');

template = require('views/templates/footer');

module.exports = FooterView = (function(_super) {
  __extends(FooterView, _super);

  function FooterView() {
    _ref = FooterView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FooterView.prototype.template = template;

  FooterView.prototype.container = '#footer-container';

  FooterView.prototype.className = 'footer';

  FooterView.prototype.autoRender = true;

  FooterView.prototype.initialize = function() {
    FooterView.__super__.initialize.apply(this, arguments);
    this.subscribeEvent('loginStatus', this.render);
    return this.subscribeEvent('startupController', this.render);
  };

  return FooterView;

})(View);
});

;require.register("views/header_view", function(exports, require, module) {
var HeaderView, View, mediator, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

View = require('views/base/view');

module.exports = HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    this.getTemplateData = __bind(this.getTemplateData, this);
    _ref = HeaderView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HeaderView.prototype.template = require('views/templates/header');

  HeaderView.prototype.id = 'header';

  HeaderView.prototype.tagName = 'nav';

  HeaderView.prototype.className = 'navbar navbar-default navbar-fixed-top';

  HeaderView.prototype.autoRender = true;

  HeaderView.prototype.initialize = function() {
    HeaderView.__super__.initialize.apply(this, arguments);
    this.subscribeEvent('loginStatus', this.render);
    return this.subscribeEvent('startupController', this.render);
  };

  HeaderView.prototype.getTemplateData = function() {
    var data;
    data = HeaderView.__super__.getTemplateData.apply(this, arguments);
    data.user = {
      username: 'DER USER'
    };
    return data;
  };

  return HeaderView;

})(View);
});

;require.register("views/home_page_view", function(exports, require, module) {
var HomePageView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = HomePageView = (function(_super) {
  __extends(HomePageView, _super);

  function HomePageView() {
    _ref = HomePageView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomePageView.prototype.autoRender = true;

  HomePageView.prototype.template = require('views/templates/home');

  HomePageView.prototype.className = 'home-page container';

  HomePageView.prototype.regions = {
    controls: '.controls',
    playlist: '.playlist'
  };

  return HomePageView;

})(View);
});

;require.register("views/icon_view", function(exports, require, module) {
var IconView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = IconView = (function(_super) {
  __extends(IconView, _super);

  function IconView() {
    _ref = IconView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  IconView.prototype.autoRender = true;

  IconView.prototype.template = require('views/templates/icon');

  IconView.prototype.className = 'icon-page container';

  return IconView;

})(View);
});

;require.register("views/layout", function(exports, require, module) {
var Chaplin, Layout, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chaplin = require('chaplin');

module.exports = Layout = (function(_super) {
  __extends(Layout, _super);

  function Layout() {
    _ref = Layout.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Layout.prototype.initialize = function() {
    return Layout.__super__.initialize.apply(this, arguments);
  };

  return Layout;

})(Chaplin.Layout);
});

;require.register("views/playlist_view", function(exports, require, module) {
var ItemView, PlaylistView, View, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

View = require('views/base/view');

ItemView = (function(_super) {
  __extends(ItemView, _super);

  function ItemView() {
    _ref = ItemView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ItemView.prototype.template = require('views/templates/playlist_item');

  ItemView.prototype.tagName = 'tr';

  ItemView.prototype.events = {
    'click .glyphicon': 'removeClick'
  };

  ItemView.prototype.removeClick = function(event) {
    event.preventDefault();
    return this.model.destroy();
  };

  return ItemView;

})(View);

module.exports = PlaylistView = (function(_super) {
  __extends(PlaylistView, _super);

  function PlaylistView() {
    this.render = __bind(this.render, this);
    _ref1 = PlaylistView.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  PlaylistView.prototype.autoRender = true;

  PlaylistView.prototype.template = require('views/templates/playlist');

  PlaylistView.prototype.className = '';

  PlaylistView.prototype.render = function() {
    var _this = this;
    PlaylistView.__super__.render.apply(this, arguments);
    this.collectionView = new Backbone.CollectionView({
      el: this.$("table"),
      modelView: ItemView,
      collection: this.collection,
      sortable: true
    });
    this.listenTo(this.collectionView, 'sortStart', function(model) {
      return _this.trigger('sort-start', model);
    });
    this.listenTo(this.collectionView, 'sortStop', function(model, newIndex) {
      return _this.trigger('sort-stop', model, newIndex);
    });
    return this.collectionView.render();
  };

  return PlaylistView;

})(View);
});

;require.register("views/site_view", function(exports, require, module) {
var SiteView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = SiteView = (function(_super) {
  __extends(SiteView, _super);

  function SiteView() {
    _ref = SiteView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SiteView.prototype.container = 'body';

  SiteView.prototype.id = 'site-container';

  SiteView.prototype.regions = {
    header: '#header-container',
    main: '#page-container'
  };

  SiteView.prototype.template = require('./templates/site');

  return SiteView;

})(View);
});

;require.register("views/templates/about", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"row\"><div style=\"text-align: center;\" class=\"page-header\"><img src=\"/img/logo.svg\" class=\"big-logo\"/><h1>augenkrebs</h1><h2>Internetabspielgerät</h2><h3>a <a href=\"http://shackspace.de\">shackspace</a> project</h3><h4>inspired by <a href=\"http://wiki.bytewerk.org/index.php/Byteplayer\">Byteplayer</a></h4><h5>incubated by <a href=\"http://shackspace.de\">shackspace</a></h5></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/controls", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"container\"><form class=\"form-inline\"><div class=\"form-group col-md-12\"><div class=\"input-group\"><input id=\"url\" type=\"text\" placeholder=\"url\" class=\"form-control\"/><div class=\"input-group-btn\"><button type=\"button\" class=\"open btn btn-primary\">Open</button><button type=\"button\" class=\"append btn btn-primary\">Append</button></div></div></div><div style=\"padding: 5em 0 2em\" class=\"text-center\"><div class=\"form-group\"><div class=\"btn-group btn-group-lg\"><button id=\"backward\" type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-backward\"></span></button><button id=\"play\" type=\"button\" style=\"color: green\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-play\"></span></button><button id=\"pause\" type=\"button\" style=\"color: blue\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-pause\"></span></button><button id=\"stop\" type=\"button\" style=\"color: red\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-stop\"></span></button><button id=\"forward\" type=\"button\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-forward\"></span></button></div></div><div style=\"padding: 0 1em\" class=\"form-group\"><input id=\"volume\" type=\"text\"/></div><div class=\"form-group\"><button id=\"muted\" type=\"button\" class=\"btn btn-default btn-lg\"><span class=\"glyphicon glyphicon-volume-off\"></span></button></div></div></form><form class=\"form-horizontal\"><div class=\"row\"><div class=\"form-group\"><label class=\"control-label col-md-2\">Audio</label><div class=\"col-md-4\"><select id=\"audiotrack-list\" class=\"form-control\"></select></div><label class=\"control-label col-md-1\">Delay</label><div class=\"col-md-1\"><input id=\"audio-delay\" type=\"text\" class=\"form-control\"/></div></div></div><div class=\"row\"><div class=\"form-group\"><label class=\"control-label col-md-2\">Subtitles</label><div class=\"col-md-4\"><select id=\"subtitles\" class=\"form-control\"></select></div><label class=\"control-label col-md-1\">Delay</label><div class=\"col-md-1\"><input id=\"subtitle-delay\" type=\"text\" class=\"form-control\"/></div></div></div></form><form class=\"form-inline\"><div class=\"form-group col-md-10 col-md-offset-1 position\"><input id=\"position\" type=\"text\"/></div></form></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/footer", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<hr/><footer><p>&copy; COPY</p></footer>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/header", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"container\"><div class=\"navbar-header\"><a href=\"/\" class=\"navbar-brand\"><img src=\"/img/logo-filled.svg\"/>augenkrebs</a></div><div class=\"collapse navbar-collapse\"><div class=\"btn-group navbar-right\"><button id=\"shutdown\" href=\"#\" class=\"btn btn-primary navbar-btn\">shutdown \n&nbsp;<span class=\"glyphicon glyphicon-off\"></span></button></div><ul style=\"margin-right: 50px\" class=\"nav navbar-nav navbar-right\"><li><a href=\"/about\">aboot</a></li></ul></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"controls\"></div><div class=\"playlist\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/icon", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"center\"><img src=\"/img/logo.svg\" class=\"huge-logo\"/></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/mixins/form_helpers", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
var textfield_mixin = function(name, value, label, disabled){
var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};
buf.push("<div class=\"control-group\"><label" + (jade.attrs({ 'for':(name), "class": [('control-label')] }, {"for":true})) + ">" + (jade.escape(null == (jade.interp = label) ? "" : jade.interp)) + "</label><div class=\"controls\">");
if ((disabled))
{
buf.push("<input" + (jade.attrs({ 'type':('text'), 'name':(name), 'value':(value), 'disabled':(true), "class": [('input-xlarge'),('disabled')] }, {"type":true,"name":true,"value":true,"disabled":false})) + "/>");
}
else
{
buf.push("<input" + (jade.attrs({ 'type':('text'), 'name':(name), 'value':(value), "class": [('input-xlarge')] }, {"type":true,"name":true,"value":true})) + "/>");
}
buf.push("</div></div>");
};;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/modal", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div class=\"modal-header\"><button class=\"close\">×</button><h3>Foo</h3></div><form class=\"form-horizontal modal-body\"></form><div class=\"modal-footer\"><button class=\"btn btn-close\">Abbrechen</button><button class=\"btn btn-primary save\">Speichern</button></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/playlist", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<table class=\"table\"></table>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/playlist_item", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),url = locals_.url;buf.push("<td>" + (jade.escape(null == (jade.interp = url) ? "" : jade.interp)) + "<span class=\"glyphicon glyphicon-remove\"></span></td>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/site", function(exports, require, module) {
var __templateData = function anonymous(locals) {
var buf = [];
buf.push("<div id=\"header-container\" class=\"header-container\"></div><div class=\"outer-page-container\"><div id=\"page-container\" class=\"page-container\"></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map