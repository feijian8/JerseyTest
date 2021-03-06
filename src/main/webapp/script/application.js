(function($) {
	var cometd = $.cometd;

	$(document).ready(
			function() {
				function _connectionEstablished() {
					$('#body').append(
							'<div>CometD Connection Established</div>');
				}

				function _connectionBroken() {
					$('#body').append('<div>CometD Connection Broken</div>');
				}

				function _connectionClosed() {
					$('#body').append('<div>CometD Connection Closed</div>');
				}

				// Function that manages the connection status with the Bayeux
				// server
				var _connected = false;
				function _metaConnect(message) {
					if (cometd.isDisconnected()) {
						_connected = false;
						_connectionClosed();
						return;
					}

					var wasConnected = _connected;
					_connected = message.successful === true;
					if (!wasConnected && _connected) {
						_connectionEstablished();
					} else if (wasConnected && !_connected) {
						_connectionBroken();
					}
				}

				// Function invoked when first contacting the server and
				// when the server has lost the state of this client
				function _metaHandshake(handshake) {
					if (handshake.successful === true) {
						cometd.batch(function() {
							cometd.subscribe('/echo', function(message) {
								var obj = jQuery.parseJSON(message.data);
								// $('#body').append('<div>Server Says: ' +
								// message.data.greeting + '</div>');
								$.each(obj.serviceOrderDTO, function(i, val) {
									$('#body').append(
											'<div>Server Order : '
													+ val.flowableID + " : "
													+ val.orderNumber
													+ '</div>');
								});
								// $('#body').append(
								// '<div>Server Says: '
								// + obj.serviceOrderDTO
								//												+ '</div>');
							});
							// Publish on a service channel since the message is
							// for the server only
							var randomnumber = Math.floor(Math.random() * 100);
							cometd.publish('/service/echo', {
								name : 'World :' + randomnumber
							});
						});
					}
				}

				// Disconnect when the page unloads
				$(window).unload(function() {
					cometd.disconnect(true);
				});

				var cometURL = "http://localhost:8080/JerseyTest/cometd";
				cometd.configure({
					url : cometURL,
					logLevel : 'debug'
				});

				cometd.addListener('/meta/handshake', _metaHandshake);
				cometd.addListener('/meta/connect', _metaConnect);

				cometd.handshake();
			});
})(jQuery);
