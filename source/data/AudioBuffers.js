/*=============================================================================
 _______  __   __  _______  _______  _______  ______    _______ 
|  _    ||  | |  ||       ||       ||       ||    _ |  |       |
| |_|   ||  | |  ||    ___||    ___||    ___||   | ||  |  _____|
|       ||  |_|  ||   |___ |   |___ |   |___ |   |_||_ | |_____ 
|  _   | |       ||    ___||    ___||    ___||    __  ||_____  |
| |_|   ||       ||   |    |   |    |   |___ |   |  | | _____| |
|_______||_______||___|    |___|    |_______||___|  |_||_______|

a mapping of names to buffers
=============================================================================*/

goog.provide("data.AudioBuffers");

/** 
	@typedef {Object}
*/
var AudioBuffers = {
	/*=========================================================================
		808!
	=========================================================================*/
	drums808 : {
		cow : "808/cow808.mp3",
		kick : "808/kick808.mp3",
		snare : "808/snare808.mp3",
		hh : "808/hh808.mp3",
		hho : "808/hho808.mp3",
		tomHi : "808/tomHi808.mp3",
		tomLow : "808/tomLow808.mp3",
	},
	/*=========================================================================
		KEYS
	keys : {
		A : {
			url : "keys/A_keys.mp3",
			buffer : null
		},
		Asharp : {
			url : "keys/As_keys.mp3",
			buffer : null
		},
		B : {
			url : "keys/B_keys.mp3",
			buffer : null
		},
		C : {
			url : "keys/C_keys.mp3",
			buffer : null
		},
		Csharp : {
			url : "keys/Cs_keys.mp3",
			buffer : null
		},
		D : {
			url : "keys/D_keys.mp3",
			buffer : null
		},
		Dsharp : {
			url : "keys/Ds_keys.mp3",
			buffer : null
		},
		E : {
			url : "keys/E_keys.mp3",
			buffer : null
		},
		F : {
			url : "keys/F_keys.mp3",
			buffer : null
		},
		Fsharp : {
			url : "keys/Fs_keys.mp3",
			buffer : null
		},
		G : {
			url : "keys/G_keys.mp3",
			buffer : null
		},
		Gsharp : {
			url : "keys/Gs_keys.mp3",
			buffer : null
		},
	},
	=========================================================================*/
	/*=========================================================================
		BASS
	=========================================================================*/
	bass : {
		/*A : {
			url : "bass/A_bass.mp3",
			buffer : null
		},
		Asharp : {
			url : "bass/As_bass.mp3",
			buffer : null
		},
		B : {
			url : "bass/B_bass.mp3",
			buffer : null
		},*/
		C : "bass/C_bass.mp3",
	/*	Csharp : {
			url : "bass/Cs_bass.mp3",
			buffer : null
		},
		D : {
			url : "bass/D_bass.mp3",
			buffer : null
		},*/
		Dsharp : "bass/Ds_bass.mp3",
	/*	E : {
			url : "bass/E_bass.mp3",
			buffer : null
		},
		F : {
			url : "bass/F_bass.mp3",
			buffer : null
		},
		Fsharp : {
			url : "bass/Fs_bass.mp3",
			buffer : null
		},
		G : {
			url : "bass/G_bass.mp3",
			buffer : null
		},
		Gsharp : {
			url : "bass/Gs_bass.mp3",
			buffer : null
		},*/
	},
	/*=========================================================================
		LEAD
	=========================================================================*/
	lead : {
		/*A : {
			url : "lead/A_lead.mp3",
			buffer : null
		},
		Asharp : {
			url : "lead/As_lead.mp3",
			buffer : null
		},
		B : {
			url : "lead/B_lead.mp3",
			buffer : null
		},
		C : {
			url : "lead/C_lead.mp3",
			buffer : null
		},*/
		Csharp : "lead/Cs_lead.mp3",
		/*D : {
			url : "lead/D_lead.mp3",
			buffer : null
		},
		Dsharp : {
			url : "lead/Ds_lead.mp3",
			buffer : null
		},
		E : {
			url : "lead/E_lead.mp3",
			buffer : null
		},*/
		F : "lead/F_lead.mp3",
		/*Fsharp : {
			url : "lead/Fs_lead.mp3",
			buffer : null
		},*/
		G : "lead/G_lead.mp3",
		/*Gsharp : {
			url : "lead/Gs_lead.mp3",
			buffer : null
		},*/
	}
};
