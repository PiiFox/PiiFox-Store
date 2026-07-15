    (function(){

        var clientVars = {

            identifyEmail: "",

            hubspotutk: ""

        };

        var loadScript = function(url, callback){

            var script = document.createElement("script");

            script.type = "text/javascript";

            if (script.readyState){

                script.onreadystatechange = function(){

                if (script.readyState == "loaded" || script.readyState == "complete"){

                    script.onreadystatechange = null;

                    callback();

                }

                };

            } else {

                script.onload = function(){

                    callback();

                };

           }

           script.src = url;

           document.getElementsByTagName("head")[0].appendChild(script);

        };

        function getCookie(c_name) {

            var c_value = document.cookie;

            var c_start = c_value.indexOf(" " + c_name + "=");

            if (c_start == -1){

                c_start = c_value.indexOf(c_name + "=");

            }

            if (c_start == -1){

                c_value = null;

            } else {

                c_start = c_value.indexOf("=", c_start) + 1;

                var c_end = c_value.indexOf(";", c_start);

                if (c_end == -1){

                    c_end = c_value.length;

                }

                c_value = unescape(c_value.substring(c_start,c_end));

            }

            return c_value;

        }

        var hubspotIdentifyVisitor = function() {

            if(clientVars["hubspotutk"] !== "" && clientVars["identifyEmail"] !== "" && clientVars["identifyEmail"] !== 'undefined') {

                var _hsq = window._hsq = window._hsq || [];

                _hsq.push(['identify', {

                    email: clientVars["identifyEmail"]

                }]);

                _hsq.push(['trackPageView']);

            }

        }

        var unificMain = function($){

            var hubspotutk_cookiename = 'hubspotutk';

            var hubspotutk = null;

            hubspotutk = getCookie(hubspotutk_cookiename);

            if(hubspotutk !== ""){

                clientVars["hubspotutk"] = hubspotutk;

            }else{

                delete clientVars["hubspotutk"];

            }

  

            $(document).on("submit", "#customer_login" , function() {

                var emailInputFieldNameValue = $("#CustomerEmail").val();

                clientVars["identifyEmail"] = emailInputFieldNameValue;

                hubspotIdentifyVisitor();

            });

            $(document).on("submit", "#create_customer" , function() {

                var emailInputFieldNameValue = $("#Email").val();

                clientVars["identifyEmail"] = emailInputFieldNameValue;

                hubspotIdentifyVisitor();

            });

        };    

  

        if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {

          loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function(){

            jQuery1111 = jQuery.noConflict(true);

            unificMain(jQuery1111);

          });

        } else {

          unificMain(jQuery);

        }

    })();