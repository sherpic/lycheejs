
lychee.define('app.state.Welcome').includes([
	'lychee.ui.State'
]).requires([
	'lychee.ui.Blueprint',
	'lychee.ui.Element',
	'lychee.ui.Layer',
	'lychee.ui.entity.Text'
]).exports(function(lychee, app, global, attachments) {

	var _BLOB = attachments["json"].buffer;



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(main) {

		lychee.ui.State.call(this, main);


		this.deserialize(_BLOB);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		serialize: function() {

			var data = lychee.ui.State.prototype.serialize.call(this);
			data['constructor'] = 'app.state.Welcome';


			return data;

		},

		deserialize: function(blob) {

			lychee.ui.State.prototype.deserialize.call(this, blob);


			this.queryLayer('ui', 'welcome > dialog').bind('change', function(value) {

				if (this.main.getState(value) !== null) {

					this.main.changeState(value);

				} else if (this.queryLayer('ui', value) !== null) {

					var val = value.charAt(0).toUpperCase() + value.substr(1);

					this.queryLayer('ui', 'menu').setValue(val);
					this.queryLayer('ui', 'menu').trigger('change', [ value ]);

				}

			}, this);

		}

	};


	return Class;

});
