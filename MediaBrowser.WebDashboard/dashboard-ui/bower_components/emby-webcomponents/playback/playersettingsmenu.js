define(["actionsheet","datetime","playbackManager","globalize","appSettings","qualityoptions"],function(actionsheet,datetime,playbackManager,globalize,appSettings,qualityoptions){"use strict";function showQualityMenu(player,btn){var videoStream=playbackManager.currentMediaSource(player).MediaStreams.filter(function(stream){return"Video"===stream.Type})[0],videoWidth=videoStream?videoStream.Width:null,options=qualityoptions.getVideoQualityOptions({currentMaxBitrate:playbackManager.getMaxStreamingBitrate(player),isAutomaticBitrateEnabled:playbackManager.enableAutomaticBitrateDetection(player),videoWidth:videoWidth,enableAuto:!0}),menuItems=options.map(function(o){var opt={name:o.name,id:o.bitrate,secondaryText:o.secondaryText};return o.selected&&(opt.selected=!0),opt}),selectedId=options.filter(function(o){return o.selected});return selectedId=selectedId.length?selectedId[0].bitrate:null,actionsheet.show({items:menuItems,positionTo:btn}).then(function(id){var bitrate=parseInt(id);bitrate!==selectedId&&playbackManager.setMaxStreamingBitrate({enableAutomaticBitrateDetection:!bitrate,maxBitrate:bitrate},player)})}function showRepeatModeMenu(player,btn){var menuItems=[],currentValue=playbackManager.getRepeatMode(player);return menuItems.push({name:globalize.translate("sharedcomponents#RepeatAll"),id:"RepeatAll",selected:"RepeatAll"===currentValue}),menuItems.push({name:globalize.translate("sharedcomponents#RepeatOne"),id:"RepeatOne",selected:"RepeatOne"===currentValue}),menuItems.push({name:globalize.translate("sharedcomponents#None"),id:"RepeatNone",selected:"RepeatNone"===currentValue}),actionsheet.show({items:menuItems,positionTo:btn}).then(function(mode){mode&&playbackManager.setRepeatMode(mode,player)})}function getQualitySecondaryText(player){return playbackManager.getPlayerState(player).then(function(state){var videoStream=(playbackManager.enableAutomaticBitrateDetection(player),playbackManager.getMaxStreamingBitrate(player),playbackManager.currentMediaSource(player).MediaStreams.filter(function(stream){return"Video"===stream.Type})[0]),videoWidth=videoStream?videoStream.Width:null,options=qualityoptions.getVideoQualityOptions({currentMaxBitrate:playbackManager.getMaxStreamingBitrate(player),isAutomaticBitrateEnabled:playbackManager.enableAutomaticBitrateDetection(player),videoWidth:videoWidth,enableAuto:!0}),selectedOption=(options.map(function(o){var opt={name:o.name,id:o.bitrate,secondaryText:o.secondaryText};return o.selected&&(opt.selected=!0),opt}),options.filter(function(o){return o.selected}));if(!selectedOption.length)return null;selectedOption=selectedOption[0];var text=selectedOption.name;return selectedOption.autoText&&(text+=state.PlayState&&"Transcode"!==state.PlayState.PlayMethod?" - Direct":" "+selectedOption.autoText),text})}function showAspectRatioMenu(player,btn){var currentId=playbackManager.getAspectRatio(player),menuItems=playbackManager.getSupportedAspectRatios(player).map(function(i){return{id:i.id,name:i.name,selected:i.id===currentId}});return actionsheet.show({items:menuItems,positionTo:btn}).then(function(id){return id?(playbackManager.setAspectRatio(id,player),Promise.resolve()):Promise.reject()})}function show(options){var player=options.player,supportedCommands=playbackManager.getSupportedCommands(player);return getQualitySecondaryText(player).then(function(secondaryQualityText){var menuItems=(options.mediaType,[]);if(supportedCommands.indexOf("SetAspectRatio")!==-1){var currentAspectRatioId=playbackManager.getAspectRatio(player),currentAspectRatio=playbackManager.getSupportedAspectRatios(player).filter(function(i){return i.id===currentAspectRatioId})[0];menuItems.push({name:globalize.translate("sharedcomponents#AspectRatio"),id:"aspectratio",secondaryText:currentAspectRatio?currentAspectRatio.name:null})}menuItems.push({name:globalize.translate("sharedcomponents#Quality"),id:"quality",secondaryText:secondaryQualityText});var repeatMode=playbackManager.getRepeatMode(player);return supportedCommands.indexOf("SetRepeatMode")!==-1&&playbackManager.currentMediaSource(player).RunTimeTicks&&menuItems.push({name:globalize.translate("sharedcomponents#RepeatMode"),id:"repeatmode",secondaryText:"RepeatNone"===repeatMode?globalize.translate("sharedcomponents#None"):globalize.translate("sharedcomponents#"+repeatMode)}),actionsheet.show({items:menuItems,positionTo:options.positionTo}).then(function(id){switch(id){case"quality":return showQualityMenu(player,options.positionTo);case"aspectratio":return showAspectRatioMenu(player,options.positionTo);case"repeatmode":return showRepeatModeMenu(player,options.positionTo)}return Promise.reject()})})}return{show:show}});