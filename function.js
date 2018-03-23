// This is meant to be deployed as a Twilio function   

exports.handler = function (context, event, callback) {

    /**
     * List of all add-ons available for Lookup as of 3/23/2018.
     * Your Lookup Add-on value is a unique name you set during the installation in the Twilio Console.
     * @type {[{}]}
     */
    let lookupOptions = [
        {"text": "Data Axle BizInfo", "value": "dataaxle_bizinfo"},
        {"text": "Whitepages Pro Caller Identification", "value": "whitepages_pro_caller_id"},
        {"text": "Whitepages Pro Phone Intelligence", "value": "whitepages_pro_phone_intel"},
        {"text": "Whitepages Pro Phone Reputation", "value": "whitepages_pro_phone_rep"},
        {"text": "Advanced Caller ID by Next Caller", "value": "nextcaller_advanced_caller_id"},
        {"text": "Twilio Carrier Information", "value": "twilio_carrier_info"},
        {"text": "Twilio Caller Name", "value": "twilio_caller_name"},
        {"text": "Payfone TCPA Compliance", "value": "payfone_tcpa_compliance"},
        {"text": "Marchex Clean Call", "value": "marchex_cleancall"},
        {"text": "Nomorobo Spam Score", "value": "nomorobo_spamscore"},
        {"text": "IceHook Systems Scout", "value": "icehook_scout1"},
        {"text": "Digital Segment Business Information", "value": "digitalsegment_businessinfo"},
        {"text": "TrueSpam by TrueCNAM", "value": "truecnam_truespam"},
        {"text": "OpenCNAM by Telo", "value": "telo_opencnam"},
        {"text": "RealPhoneValidation RPV Turbo", "value": "real_phone_validation_rpv_turbo"}
    ];

    let addons = [];
    let params = [];
    let payload;

    const client = context.getTwilioClient();
    // console.info("Event information passed into the function ", event);

    if ("payload" in event) {
        payload = JSON.parse(event.payload);
        // console.info("Payload information in the event object ", payload);
    } else {
        payload = event;
    }

    if (payload.token !== context.LOOKUP_SLACKBOT_TOKEN) {
        callback(null, "Unauthorized access");
    }

    // split event.text. expected format : "<e164 number> <add-on unique name, optional>"
    if ("text" in payload) {
        if (payload.text.trim().length > 0) {
            params = payload.text.trim().split(" ");
        }
    } else if ("actions" in payload) {
        params = payload.actions[0].selected_options[0].value.trim().split(" ");
    }

    switch (params.length) {
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

    // adding the submitted phone number to the string with addons.
    for (let i = 0; i < lookupOptions.length; i++) {
        lookupOptions[i].value = `${params[0]} ${lookupOptions[i].value}`
    }

    // console.info("Lookup Options: ", lookupOptions);

    let slackResponse = {};
    slackResponse.response_type = "in_channel";
    slackResponse.attachments = [{}, {}];
    slackResponse.attachments[0].text = "";
    slackResponse.attachments[0].title = "Looking up " + params[0] + " using " + addons;
    slackResponse.attachments[0].title_link = "https://www.twilio.com/console/add-ons/product/lookup";
    slackResponse.attachments[0].color = "#36a64f";
    slackResponse.attachments[0].mrkdwn_in = ["text", "pretext"];

    slackResponse.attachments[0].callback_id = "addon_selection";
    slackResponse.attachments[0].actions = [{}];
    slackResponse.attachments[0].actions[0].name = "addons_list";
    slackResponse.attachments[0].actions[0].type = "select";
    slackResponse.attachments[0].actions[0].text = "Select another Add-on";
    slackResponse.attachments[0].actions[0].options = lookupOptions;

    slackResponse.attachments[1].color = "#36a64f";
    slackResponse.attachments[1].mrkdwn_in = ["text", "pretext"];
    slackResponse.attachments[1].footer = "Lookup Slash command - Instructions and code here: github.com/AuthySE/lookup-slack-bot";

    client.lookups.v1.phoneNumbers(params[0]).fetch({'addOns': addons}).then(function (number) {
        // success
        console.error(number);
        slackResponse.attachments[1].text = "```" + JSON.stringify(number.addOns.results, null, 4) + " ```";
        callback(null, slackResponse);
    }, function (reason) {
        // rejection
        callback(null, "Lookup failed with error: " + reason.message);
    });

};
