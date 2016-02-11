
lychee.define('fertilizer.template.html-webview.Application').requires([
	'lychee.data.JSON',
	'fertilizer.data.Filesystem'
]).includes([
	'fertilizer.Template'
]).exports(function(lychee, fertilizer, global, attachments) {

	var _JSON      = lychee.data.JSON;
	var _templates = {
		icon:  attachments["icon.png"].buffer,
		index: attachments["index.tpl"].buffer
	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		fertilizer.Template.call(this, data);

		this.__icon  = _templates['icon'];
		this.__index = _templates['index'].toString();



		/*
		 * INITIALIZATION
		 */

		this.bind('configure', function(oncomplete) {

			var env = this.environment;
			var fs  = this.filesystem;

			if (env !== null && fs !== null) {

				console.log('fertilizer: CONFIGURE');

				env.setPackages([]);

				var tmp       = new fertilizer.data.Filesystem(fs.root + '/../../../source');
				var has_icon  = tmp.info('/icon.png');
				var has_index = tmp.info('/index.html');

				if (has_icon !== null) {
					this.__icon = tmp.read('/icon.png');
				}

				if (has_index !== null) {

					this.__index = tmp.read('/index.html').toString();
					this.__index = this.__index.replace('/libraries/lychee/build/html/core.js', './core.js');

					var tmp1 = this.__index.indexOf('<script>');
					var tmp2 = this.__index.indexOf('</script>', tmp1);
					var tmp3 = _templates['index'].indexOf('<script>');
					var tmp4 = _templates['index'].indexOf('</script>', tmp3);

					if (tmp1 !== -1 && tmp2 !== -1 && tmp3 !== -1 && tmp4 !== -1) {
						var inject   = _templates['index'].substr(tmp3, tmp4 - tmp3 + 9);
						this.__index = this.__index.substr(0, tmp1) + inject + this.__index.substr(tmp2 + 9);
					}

				}

			}

			oncomplete(true);

		}, this);

		this.bind('build', function(oncomplete) {

			var env = this.environment;
			var fs  = this.filesystem;

			if (env !== null && fs !== null) {

				console.log('fertilizer: BUILD ' + env.id);

				var id      = env.id;
				var version = ('' + lychee.VERSION);

				var profile = _JSON.encode(this.profile);
				var blob    = _JSON.encode(env.serialize());
				var core    = this.getCore('html-nwjs');
				var info    = this.getInfo(true);

				var icon    = this.__icon;
				var index   = this.__index;


				core  = this.getInfo(false) + '\n\n' + core;
				index = this.replace(index, {
					blob:    blob,
					id:      id,
					init:    init,
					profile: profile
				});


				fs.write('/icon.png',   icon);
				fs.write('/core.js',    core);
				fs.write('/index.html', index);

				oncomplete(true);

			} else {

				oncomplete(false);

			}

		}, this);

		this.bind('package', function(oncomplete) {

			var runtime_fs = new fertilizer.data.Filesystem('/bin/runtime/html-webview');
			var runtime_sh = new fertilizer.data.Shell('/bin/runtime/html-webview');
			var project_fs = this.filesystem;
			var project_id = this.environment.id.split('/').pop();

			if (project_fs !== null) {

				console.log('fertilizer: PACKAGE ' + project_fs.root + ' ' + project_id);

				if (runtime_fs.info('/package.sh') !== null) {

					var result = runtime_sh.exec('/package.sh ' + project_fs.root + ' ' + project_id);
					if (result === true) {

						oncomplete(true);

					} else {

						runtime_sh.trace();
						oncomplete(false);

					}

				} else {

					oncomplete(false);

				}

			} else {

				oncomplete(false);

			}

		}, this);

	};


	Class.prototype = {

	};


	return Class;

});

