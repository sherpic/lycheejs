
lychee.define('sorbet.serve.api.Library').requires([
	'lychee.data.JSON',
	'sorbet.mod.Server'
]).exports(function(lychee, sorbet, global, attachments) {

	var _JSON   = {
		encode: JSON.stringify,
		decode: JSON.parse
	};
	var _Server = sorbet.mod.Server;



	/*
	 * HELPERS
	 */

	var _HEADER = {
		'status':                      200,
		'access-control-allow-origin': '*',
		'content-control':             'no-transform',
		'content-type':                'application/json'
	};


	var _serialize = function(library) {

		var filesystem = null;


		if (library.filesystem !== null) {

			filesystem = library.filesystem.root;

		}


		return {
			identifier: library.identifier,
			filesystem: filesystem,
			sorbet:     library.sorbet
		};

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		process: function(host, url, data, ready) {

			var method     = data.headers.method;
			var parameters = data.headers.parameters;
			var identifier = null;


			if (parameters instanceof Object) {
				identifier = parameters.identifier || null;
			}



			/*
			 * 1: OPTIONS
			 */

			if (method === 'OPTIONS') {

				ready({
					headers: {
						'status':                       200,
						'access-control-allow-headers': 'Content-Type',
						'access-control-allow-origin':  '*',
						'access-control-allow-methods': 'GET',
						'access-control-max-age':       60 * 60
					},
					payload: ''
				});



			/*
			 * 2: GET
			 */

			} else if (method === 'GET') {

				if (identifier !== null) {

					var library = host.getLibrary(identifier);
					if (library !== null) {

						ready({
							headers: _HEADER,
							payload: _JSON.encode(_serialize(library))
						});

					} else {

						ready({
							headers: { 'status': 404, 'content-type': 'application/json' },
							payload: _JSON.encode({
								error: 'Library not found.'
							})
						});

					}

				} else {

					ready({
						headers: _HEADER,
						payload: _JSON.encode(host.libraries.map(_serialize))
					});

				}



			/*
			 * X: OTHER
			 */

			} else {

				ready({
					headers: { 'status': 405, 'content-type': 'application/json' },
					payload: _JSON.encode({
						error: 'Method not allowed.'
					})
				});

			}

		}

	};


	return Module;

});
