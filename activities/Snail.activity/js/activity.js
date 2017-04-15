define(["sugar-web/activity/activity", "activity/app", "activity/utility"], function (activity) {

	// Manipulate the DOM only when it is ready.
	require(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();

		// Initialize SNAIL
		app.main.init();
	});

});
