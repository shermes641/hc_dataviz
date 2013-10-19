'use strict';
/**
 * @fileOverview Provides interface with HC JSON datasources and data page UI functionality.
 * @module DataController
 * @author {@link <a href="mailto:stevehermes@gmail.com">Steve Hermes</a>}
 * @version 1.0.0
 */

/**
 Angular / Kendo-UI functionality
 @module genPieController
 @main Define data controller and datasources
 **/

/**
 * Provides interface with HC JSON datasources and data page UI functionality.<br>
 * @class  genPieCtrl
 */
angular.module('hcDatavizApp')
    /**
     * Provides interface with HC JSON datasources and data page UI functionality.<br>
     * Reference Angular Controller:   <a href="http://code.angularjs.org/1.0.8/docs/guide/dev_guide.mvc.understanding_controller" target="_blank">( Angular Docs )</a>
     * @method  controller
     * @param {String} controller name
     * @param {Function} anonymous function to setup the controller's scope
     * @chainable
     * version 1.0.0
     * @since 1.0.0
     */
    .controller('GenPieCtrl', ['$scope', function ($scope) {

        $scope.pie = ({
            title: {
                position: "bottom",
                text: "Hover over chart to see charger performance"
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category #: #= value#%"
                }
            },
            series: [
                {
                    type: "pie",
                    startAngle: 150,
                    data: [

                    ]
                }
            ],
            tooltip: {
                visible: true,
                format: "{0}%"
            }
        });
    }]);
