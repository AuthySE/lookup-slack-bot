// This is meant to be deployed as a Twilio function   
  
  exports.handler = function(context, event, callback) {
	const client = context.getTwilioClient();
	console.log(event);
  
  	var payload;
  	if ("payload" in event) {
      payload = JSON.parse(event.payload);
      console.log(payload);
    } else {
      payload = event;
    }
  
  	if (payload.token !== context.LOOKUP_SLACKBOT_TOKEN) {
      callback(null, "Unauthorized access");
    }
  
  	// split event.text. expected format : "<e164 number> <add-on unique name, optional>"
  	var params = [];
  	var addons = [];
  	
  	if ("text" in payload) {
      if (payload.text.trim().length > 0) {
        params = payload.text.trim().split(" ");
      }       
    } else if ("actions" in payload) {
        params = payload.actions[0].selected_options[0].value.trim().split(" ");
    }
  
  	console.log(params)
  
  	switch(params.length) {
      case 0:
	    callback(null, "Usage: /lookup <e164 number> <add-on unique name(s) comma separated>.");
        break;
      case 1:
        addons.push('twilio_carrier_info');
        break;        
      case 2:
        addons = params[1].split(",");                	    
      break;
    }
  
  	var slackResponse = {};
  	//slackResponse.text = "Looking up " + params[0] + " using " + addons;
  	slackResponse.response_type = "in_channel";
  	slackResponse.attachments = [{},{}];
    slackResponse.attachments[0].text =  "";
    slackResponse.attachments[0].title = "Looking up " + params[0] + " using " + addons;
  	slackResponse.attachments[0].title_link = "https://www.twilio.com/console/add-ons/product/lookup";
	slackResponse.attachments[0].color =  "#36a64f";
	slackResponse.attachments[0].mrkdwn_in = ["text","pretext"];
  	//slackResponse.attachments[0].footer = "Lookup Slash command - still in development. Rough edges, etc. #team-marketplace for support.";

   	slackResponse.attachments[0].callback_id = "addon_selection";
  	slackResponse.attachments[0].actions = [{}];
	slackResponse.attachments[0].actions[0].name = "addons_list";
	slackResponse.attachments[0].actions[0].type = "select";
  	slackResponse.attachments[0].actions[0].text = "Select another Add-on";
  	slackResponse.attachments[0].actions[0].options = 
      [ {"text":"Twilio Carrier Info","value":params[0] + " twilio_carrier_info"},
        {"text":"RealPhoneValidation","value":params[0] + " real_phone_validation_rpv_turbo"},
		{"text":"Whitepages Pro Phone Intel","value":params[0] + " whitepages_pro_phone_intel"},
		{"text":"Icehook Scout","value":params[0] + " icehook_scout"},
		{"text":"Twilio Caller Name","value":params[0] + " twilio_caller_name"},
		{"text":"Whitepages Pro Caller ID","value":params[0] + " whitepages_pro_caller_id"},
		{"text":"Nextcaller Advanced Caller ID","value":params[0] + " nextcaller_advanced_caller_id"},
		{"text":"Telo OpenCNAM","value":params[0] + " telo_opencnam"},
		{"text":"Digital Segment Business Intel","value":params[0] + " digitalsegment_businessinfo"},
		{"text":"Whitepages Pro Phone Reputation","value":params[0] + " whitepages_pro_phone_rep"},             			    {"text":"Nomorobo Spam Score","value":params[0] + " nomorobo_spamscore"},  			              			
        {"text":"TruSpam by TruCNAM","value":params[0] + " truecnam_truespam"}];
  
  	slackResponse.attachments[1].color =  "#36a64f";
	slackResponse.attachments[1].mrkdwn_in = ["text","pretext"];
  	slackResponse.attachments[1].footer = "Lookup Slash command - still in development. Rough edges, etc. #team-marketplace for support.";
  
  
    client.lookups.v1.phoneNumbers(params[0]).fetch({'addOns':addons}).then(function(number){ 
      // success
      console.log(number);
      slackResponse.attachments[1].text = "```" + JSON.stringify(number.addOns.results, null, 4) + " ```";
      callback(null, slackResponse);
    },
                                                                            function(reason) {
      // rejection
      console.log(reason);
      callback(null, "Lookup failed with error: " + reason.message);
    });
  
};
