//IIFE helps avoid variable(local/global) collisions.
(function () {
    'use strict';

    //One component per file -->easier to read, maintain, unit testing, mocking, avoid collisions and hidden bugs
    angular.module('zoneapp').factory('pubnubService', pubnubService);

    pubnubService.$inject = ['Pubnub'];

    function pubnubService(Pubnub) {

        //placing the callable members at the top makes it easy to read
        var pubnubFactory = {
            //make function declarations to hide implementation details
            getPubnubStaus: getPubnubStaus,
        };
        return pubnubFactory;

        function getPubnubStaus(channelPack) {
            var pubnubStatus = null;
            Pubnub.setAuthKey(channelPack);
            Pubnub.history(
                {
                    channel: channelPack,
                    reverse: false, // true to send via post
                    count: 1 // how many items to fetch
                },
                function (status, response) {
                    if (response) {
                        angular.forEach(response.messages, function (value, key) {
                            pubnubStatus = value.entry;
                        });
                    }
                }
            );
            return pubnubStatus;
        }
    }
})();
