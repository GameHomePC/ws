(function(_window){

	_window.onload = function(){

		var users = {};
		var userRender = function(ctx, user){
			ctx.fillStyle = 'black';
			ctx.beginPath();
			ctx.arc(user.x, user.y, user.radius, 0, Math.PI * 2, false);
			ctx.fill();
		};

		function WebSocketReconnect(){
			this.reconnectDelay = 500;
		}

		WebSocketReconnect.prototype = {
			connect: function(url){
				var self = this;

				this.ws = new WebSocket(url);

				this.ws.onopen = function(event){
					// console.log('open');
				};

				this.ws.onerror = function(event){
					console.log('error');
				};

				this.ws.onclose = function(event){
					console.log('close');

					setTimeout(function(){
						self.connect(url);
					}, self.reconnectDelay);
				};

				this.ws.onmessage = function(event){
					// console.log('message');

					var data = event.data;
					var action, id;

					if (typeof data === 'string'){

						try {

							data = JSON.parse(data);
							action = data.a;

							switch(action){
								case 'cu':
									id = data.i;

									if (id in users){
										console.log('update');
										var user = users[id];

										user.x = data.x;
										user.y = data.y;
										user.radius = data.r;

									} else {

										console.log('create');
										users[id] = {
											x: data.x,
											y: data.y,
											radius: data.r,
											old: {
												x: data.x,
												y: data.y,
												radius: data.r
											}
										};

									}

									break;
								case 'r':
									id = data.i;

									if (id in users){
										console.log('remove');
										delete users[id];
									} else {
										console.log('not remove');
									}

									break;
							}

						} catch(error){}

					}
				};

				return this;

			},
			send: function(data){
				if (this.ws && this.ws.readyState === this.ws.OPEN){
					this.ws.send(data);
				}
			}
		};

		var ws = new WebSocketReconnect().connect('ws://localhost:8001/game');

		var isL = false;
		var isR = false;
		var isT = false;
		var isB = false;

		var canvas = document.getElementById('game');
		var context = canvas.getContext('2d');

		(function loop(){

			context.clearRect(0, 0, canvas.width, canvas.height);

			for (var uid in users){
				if (users.hasOwnProperty(uid)){

					userRender(context, users[uid]);

				}
			}

			window.requestAnimationFrame(loop);

		})();

		window.addEventListener('keydown', function(e){

			var keys = [37, 38, 39, 40];
			var key = (e.which) ? e.which : e.keyCode;

			if (keys.indexOf(key) !== -1){
				e.preventDefault();

				var data = {};

				switch(key){
					case 37:
						isL = true;
						break;
					case 38:
						isT = true;
						break;
					case 39:
						isR = true;
						break;
					case 40:
						isB = true;
						break;
				}
				
			}


			if (isL) ws.send(JSON.stringify({i: 1}));
			if (isT) ws.send(JSON.stringify({i: 2}));
			if (isR) ws.send(JSON.stringify({i: 3}));
			if (isB) ws.send(JSON.stringify({i: 4}));

		});

		window.addEventListener('keyup', function(e){

			var keys = [37, 38, 39, 40];
			var key = (e.which) ? e.which : e.keyCode;

			if (keys.indexOf(key) !== -1){
				e.preventDefault();

				var data = {};

				switch(key){
					case 37:
						isL = false;
						break;
					case 38:
						isT = false;
						break;
					case 39:
						isR = false;
						break;
					case 40:
						isB = false;
						break;
				}
				
			}


		});

	};

})(window);