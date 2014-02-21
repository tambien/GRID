/*============================================================
 __   __  _______  ______    _______  ___   _______  __    _ 
|  | |  ||       ||    _ |  |       ||   | |       ||  |  | |
|  |_|  ||    ___||   | ||  |  _____||   | |   _   ||   |_| |
|       ||   |___ |   |_||_ | |_____ |   | |  | |  ||       |
|       ||    ___||    __  ||_____  ||   | |  |_|  ||  _    |
 |     | |   |___ |   |  | | _____| ||   | |       || | |   |
  |___|  |_______||___|  |_||_______||___| |_______||_|  |__|
=============================================================*/

goog.provide("managers.Version");

var Version = {
    /** @type {string} */
	releaseVersion : "",
	
	/** @type {string} */
	build : "",
	
	/** @type {string} */
	commit : "",
	
	/** @type {string} */
	versionURI : "./build/version.json",
    
	/** @private 
	@type {boolean} */
	loadedVersionData : false,
	

    /** initializer */
	initialize : function(){
		//Version.loadVersionData();
	},

	/** 
		loads the version info from a static file
	*/
	loadVersionData : function (cb) {
		LoadingManager.loadJSON(Version.versionURI, function(data){
			Version.releaseVersion 	= data["version"];
			Version.build 			= data["build"];
			Version.commit 			= data["commithash"];
			// Maybe we won't use this?
			Version.loadedVersionData = true;
			console.log("Version.releaseVersion [version]: " + Version.releaseVersion);

			cb();
		});
	}
}
Version.initialize();