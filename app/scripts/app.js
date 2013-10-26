'use strict';
/**
 * @fileOverview The main application module providing Angular / Kendo-UI functionality.
 * @module Application
 * @author {@link <a href="mailto:stevehermes@gmail.com">Steve Hermes</a>}
 * @version 1.0.0
 */

/**
* hcDatavizApp Angular module   <a href="http://code.angularjs.org/1.0.8/docs/api/angular.Module" target="_blank">( Angular Docs )</a>
*
* @module Application
* @class Application
*/
angular
    /**
     * hcDatavizApp Angular module   <a href="http://code.angularjs.org/1.0.8/docs/api/angular.Module" target="_blank">( Angular Docs )</a>
     *
     * @method module
     * @param {String} name application name
     * @param {String[]} dependencies Kendo UI and JQuery UI directives
     * @chainable
     * version 1.0.0
     * @since 1.0.0
     */
    .module('hcDatavizApp', ['kendo.directives', 'jui'])
/**
 * Configure routes <br><br>
 *      Configuration blocks - get executed during the provider registrations and configuration phase.<br>
 *      Only providers and constants can be injected into configuration blocks.<br>
 *      This is to prevent accidental instantiation of services before they have been fully configured.<br>
 * @method config
 * @param {Function} configFn typically a Angular service.    <a href="http://code.angularjs.org/1.0.8/docs/guide/dev_guide.services" target="_blank">( Angular Docs )</a>
 * @chainable
 * verson 1.0.0
 * @since 1.0.0
 */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/data.html',
                    controller: 'DataCtrl'
                })
                .otherwise({
                    redirectTo: '/'
            });
    });
angular.module('hcDatavizApp')
/**
 * Add __draggable__ tag   __directive__ <a href="http://code.angularjs.org/1.0.8/docs/guide/directive" target="_blank">( Angular Docs )</a>
 * <br>If an element has the __draggable__ tag, then it can be dragged anywhere on the page.<br>
 * <br>While being dragged, the element is styled as follows:
 *
        //Style the element, and bind the mousemove and mouseup events.
        element.css({
            position: 'relative',
            backgroundColor: 'lightgrey',
            cursor: 'move'
        });
 * Note: Could not use the the JQuery __resizable__ tag with the __draggable__ tag, so I added this directive.
 * @method directive
 * @param {String} tag  name for tag
 * @param {Function} anonymous with single dom argument
 * @chainable
 * @version 1.0.0
 * @since 1.0.0
 */
    .directive('draggable', function ($document) {
        return function (scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            var bg = element.css('backgroundColor');
            var curs = element.css('cursor');
			var brd = element.css('border');
			var op = element.css('opacity');
            /**
             * style the element, bind the mousemove and mouse up events
             * @method element.on
             * @private
             */
            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                element.css({
                    position: 'relative',
                    backgroundColor: 'lightgrey',
                    cursor: 'move',
					opacity: '0.5',
					border: '1px solid red'
                });
                element.corner();
                startX = event.screenX ;
                startY = event.screenY ;
                element.l = Math.floor(element.position().left);
                element.t = Math.floor(element.position().top);
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            /**
             move the element if __resizable__ is not active
             @method mousemove
             @private
             **/
            function mousemove(event) {
                if ($('body').css('cursor').indexOf('-resize') == -1) {
                    y = event.screenY - startY;
                    x = event.screenX - startX;
                    element.offset({ top: (y+element.t), left: (x+element.l) });
                }
            }
            /**
             Restores the element when finished moving
             @method mouseup
             @private
             **/
            function mouseup() {
                element.css({
                    position: 'relative',
                    backgroundColor: bg,
                    cursor: curs,
					border: brd,
					opacity: op
                });
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    })
//<![CDATA[
$(function () {
    $(".themeChooser")
        /**
         *  Allows skinning the application<br>
         * and configure the theme chooser drop down list element <a href="http://docs.kendoui.com/api/web/dropdownlist" target="_blank">( Kendo Docs )</a>
         * @class ThemeChooser
         * @since 1.0.0
         */
        /**
         * Initialize the ThemeChooser element
         * @method kendoDropDownList
         * @param {JSON} config options for Kendo dropdownlist
         */
        .kendoDropDownList({
            /**
             * Available themes (HoneyComb is a local theme)
             *
             *      [
             { text: "HoneyComb", value: "hc"},
             { text: "Black", value: "black" },
             { text: "Blue Opal", value: "blueopal" },
             { text: "Default", value: "default" },
             { text: "Metro", value: "metro" },
             { text: "Silver", value: "silver" }
             ]
             * @attribute dataSource
             * @type Json[]
            */
            dataSource: [
                { text: "HoneyComb", value: "hc"},
                { text: "Black", value: "black" },
                { text: "Blue Opal", value: "blueopal" },
                { text: "Default", value: "default" },
                { text: "Metro", value: "metro" },
                { text: "Silver", value: "silver" }
            ],
             /**
              * __text__ element of __dataSource__
              * @property dataTextField
              * @type String
              */
            dataTextField: "text",
             /**
              * __value__ element of __dataSource__
              * @property dataValueField
              * @type String
              */
            dataValueField: "value",
            /**
             * Changes the theme.<br>
             * See {{#crossLink "ThemeChooser/changeTheme:method"}}{{/crossLink}}
             * @method change
             * @param {Element} e The selected theme
             */
            change: function (e) {
                var theme = (this.value() || "hc").toLowerCase();
                changeTheme(theme);
            }
        });

    /**
     * Sets the active theme.
     * @method changeTheme
     * @param {String} skinName Must match __text__  in {{#crossLink "ThemeChooser/dataSource:attribute"}}{{/crossLink}}
     * @param {Boolean} animate If __true__ the css link is preloaded
     * @since 1.0.0
     */
    function changeTheme(skinName, animate) {
        var doc = document,
            kendoLinks = $("link[href*='kendo.']", doc.getElementsByTagName("head")[0]),
            commonLink = kendoLinks.filter("[href*='kendo.common']"),
            skinLink = kendoLinks.filter(":not([href*='kendo.common'])"),
            href = location.href,
            skinRegex = /kendo\.\w+(\.min)?\.css/i,
            extension = skinLink.attr("rel") === "stylesheet" ? ".css" : ".less",
            url = commonLink.attr("href").replace(skinRegex, "kendo." + skinName + "$1" + extension);
        function preloadStylesheet(file, callback) {
            var element = $("<link rel='stylesheet' media='print' href='" + file + "'>").appendTo("head");
            setTimeout(function () {
                callback();
                element.remove();
            }, 100);
        }
        function replaceTheme() {
            var oldSkinName = $(doc).data("kendoSkin"),newLink;
            if (kendo.support.browser.msie) {
                newLink = doc.createStyleSheet(url);
            } else {
                newLink = skinLink.eq(0).clone().attr("href", url);
                newLink.insertBefore(skinLink[0]);
            }
            skinLink.remove();
            $(doc.documentElement).removeClass("k-" + oldSkinName).addClass("k-" + skinName);
        }
        if (skinName == 'hc')
            url = "custom/style/kendo.hc.min.css";
        if (animate) {
            preloadStylesheet(url, replaceTheme);
        } else {
            replaceTheme();
        }
    };
    $("#tree").kendoTreeView({
        checkboxes: {
            checkChildren: true
        },
        dataSource: [
            {
                id: 1,
                text: "Value axis",
                checked: true,
                expanded: true,
                items: [
                    {
                        id: 2,
                        text: "Battery Voltage",
                        checked: true
                    },
                    {
                        id: 3,
                        text: "Battery Current",
                        checked: true
                    }
                ]
            }
        ]
    }).data("kendoTree");
    $("#tree").on("change", function (e) {
        var chart = $("#genChart").data("kendoChart");
        var max = -10000000000000.0;
        $('#tree input').each(function (index, e) {
            if (index != 0) {
                //if (valueAxes.name == nodeText.trim()) {
                //    checkedSeries.push(valueAxes);
                //    checkedSeries.visible = true;
                chart.options.series[index - 1].visible = (e.checked == true);
                if (e.checked == true)
                    if (max < chart.options.series[index - 1].max)
                        max = chart.options.series[index - 1].max;
                //}
            }
        });
        chart.options.valueAxis.max = max;
        //chart.options.valueAxes = checkedSeries;
        chart.refresh();
    });
    //default to HoneyComb
    changeTheme('hc', true);
});//]]>