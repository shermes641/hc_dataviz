'use strict';
/**
 * @fileOverview Provides interface with HC JSON datasources and data page UI functionality.
 * @module DataController
 * @author {@link <a href="mailto:stevehermes@gmail.com">Steve Hermes</a>}
 * @version 1.0.0
 */

/**
 Angular / Kendo-UI functionality
 @module DataController
 @main Define data controller and datasources
 **/

/**
 * Provides interface with HC JSON datasources and data page UI functionality.<br>
 * @class  DataCtrl
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
    .controller('DataCtrl', ['$scope', function ($scope) {




        /**
         * Code specific to the Kendo Chart
         * Reference: <a href="http://docs.kendoui.com/api/dataviz/chart" target="_blank">( Kendo Docs )</a><br>
         * @submodule  AggregateChart
         */
        /**
         * Provides interface with HC JSON datasources and data page UI functionality.<br>
         * @class  AggregateChartClaz
         */

        /**
         * Kendo DataSource of aggregate chart.<b>
         * Reference: <a href="http://docs.kendoui.com/api/framework/datasource" target="_blank">( Kendo Docs )</a><br>
         * After aggegation, the datasource data array has 1 object for each day of data:
         *
             {
                  IbC: "0.00"
                  Vb: "25.03"
                  logDate: "2013-09-14"
             }
         *
         * Note: all elements are turned into strings.
         * This works around the Kendo Grid filter function not handling other data types<br>
         *
         *  and the $scope.aggrGenData object has the following elements:
         *
            {
                ABSORPTION: Array[]
                DATE: Array[]
                FLOAT: Array[]
                MPPT: Array[]
                NIGHT: Array[]
                SUM: Array[]
            }
         *

         * @attribute $scope.chartData
         * @type kendo.data.DataSource
         */
        $scope.chartData = new kendo.data.DataSource({
            transport: {
                read: "custom/data/gen.json"
            },
            requestStart: function () {
                kendo.ui.progress($("#loading"), true);
            },
            /**
             * Aggregates the data source into daily averages and fills $scope.aggrGenData with charger operating state data<br>
             * There is aggregated data for each day in the dataset.<br>
             * <b>NOTE:</b> Assumes the data is from a MorningStar charge controller
             * @method requestEnd
             * @param {DataSource} data  the raw generation data
             * @chainable
             * @version 1.0.0
             * @since 1.0.0
             */
            requestEnd: function (data) {
                if (data && data.response.length > 3) {
                    var cnt = 1;
                    var st = 0;
                    var vb = data.response[0]['Vb'];
                    var vi = data.response[0]['IbC'];
                    var max = [vb, vi];

                    var lastState = data.response[0]['chState'].toUpperCase().trim();
                    $scope.aggrGenData = {};
                    $scope.aggrGenData['NIGHT'] = [];
                    $scope.aggrGenData['ABSORPTION'] = [];
                    $scope.aggrGenData['FLOAT'] = [];
                    $scope.aggrGenData['MPPT'] = [];
                    $scope.aggrGenData['DATE'] = [];
                    $scope.aggrGenData['SUM'] = [];
                    $scope.aggrGenData['NIGHT'].push(0);
                    $scope.aggrGenData['ABSORPTION'].push(0);
                    $scope.aggrGenData['FLOAT'].push(0);
                    $scope.aggrGenData['MPPT'].push(0);
                    $scope.aggrGenData['DATE'].push(data.response[0]['logDate'].split(" ")[0]);
                    $scope.aggrGenData['SUM'].push(0);
                    var stateIdx = 0;
                    var ms =  new Date(data.response[0]['logDate']).getTime();
                    for (var i = 1; i < data.response.length; i++) {
                        if (data.response[i - 1]['logDate'].split(" ")[0] == data.response[i]['logDate'].split(" ")[0]) {
                            var hr =  (new Date(data.response[i]['logDate']).getTime() - ms)/1000/60/60;
                            $scope.aggrGenData[lastState][stateIdx] += hr;
                            lastState = data.response[i]['chState'].toUpperCase().trim();
                            ms =  new Date(data.response[i]['logDate']).getTime();

                            vb += data.response[i]['Vb'];
                            vi += data.response[i]['IbC'];
                            cnt++;
                            //var myDate = new Date(data.response[i]['logDate']);
                            //console.log((myDate.getMonth() + 1) + "-" + myDate.getDate() + "-" + myDate.getFullYear());
                        } else {
                            //give the last minutes of each day to whatever state was current
                            var hr =  (new Date(data.response[i]['logDate']).getTime() - ms)/1000/60/60;
                            $scope.aggrGenData[lastState][stateIdx] += hr;
                            $scope.aggrGenData['SUM'][stateIdx] += $scope.aggrGenData['NIGHT'][stateIdx];
                            $scope.aggrGenData['SUM'][stateIdx] += $scope.aggrGenData['ABSORPTION'][stateIdx];
                            $scope.aggrGenData['SUM'][stateIdx] += $scope.aggrGenData['FLOAT'][stateIdx];
                            $scope.aggrGenData['SUM'][stateIdx] += $scope.aggrGenData['MPPT'][stateIdx];
                            $scope.aggrGenData['NIGHT'].push(0);
                            $scope.aggrGenData['ABSORPTION'].push(0);
                            $scope.aggrGenData['FLOAT'].push(0);
                            $scope.aggrGenData['MPPT'].push(0);
                            $scope.aggrGenData['DATE'].push(data.response[i]['logDate'].split(" ")[0]);
                            $scope.aggrGenData['SUM'].push(0);
                            stateIdx++;
                            ms =  new Date(data.response[i]['logDate']).getTime();
                            lastState = data.response[i]['chState'].toUpperCase().trim();
                            data.response[st] = {};
                            data.response[st]['logDate'] = data.response[i - 1]['logDate'].split(" ")[0];
                            data.response[st]['Vb'] = (vb / cnt).toFixed(2);
                            data.response[st]['IbC'] = (vi / cnt).toFixed(2);
                            if (data.response[st]['Vb'] > max[0])
                                max[0] = data.response[st]['Vb'];
                            if (data.response[st]['IbC'] > max[1])
                                max[1] = data.response[st]['IbC'];
                            cnt = 1;
                            st++;
                            vb = data.response[i]['Vb'];
                            vi = data.response[i]['IbC'];
                        }
                    }
                    data.response.splice(st);
                    max[0] *= 1.1;
                    max[1] *= 1.1;
                    var chart = $("#genChart").data("kendoChart");
                    if (max[0] > max[1])
                        chart.options.valueAxis.max = max[0];
                    else
                        chart.options.valueAxis.max = max[1];
                    chart.options.series[0].max = max[0];
                    chart.options.series[1].max = max[1];
                    chart.refresh();
                }
                kendo.ui.progress($("#loading"), false);
            }
        });

        /**
         * The options for the aggregate chart
         * @attribute $scope.aggr_chart_columns
         */
        $scope.aggr_chart_options = {
             tooltip: {
                visible: true,
                format: "{0}",
                template: "#= tooltipTemplate(dataItem) #"
            },
            title: {
                text: "Daily data"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "line"
            },
            series: [
                {
                    name: "Battery Voltage",
                    field: "Vb",
                    color: "#D8D846"
                },
                {
                    name: "Charge Current",
                    field: "IbC",
                    color: "#2F752F"
                }
            ],
            valueAxis: {
                max: 50,
                line: {
                    visible: true
                },
                minorGridLines: {
                    visible: true
                }
            },
            categoryAxis: {
                field: "logDate",
                labels: {
                    rotation: -90
                },
                majorGridLines: {
                    visible: false
                }
            },
            chartArea: {
                background: ""
            }
        };


        $scope.onSeriesHover = function(e) {
            var sum = $scope.aggrGenData['SUM'];
            var idx = 0;
            while (($scope.aggrGenData['DATE'][idx] != e.category) && (idx != ($scope.aggrGenData['DATE'].length-1)))
                idx++;
            var xx = e.category+'  '+$scope.aggrGenData['SUM'][idx].toFixed(1) +' hrs ';
            xx += kendo.format(" Avg {0} : {1} ", e.series.name, e.value);
            var suffix = 'amps';
            if (xx.indexOf('Volt') != -1)
                suffix = 'volts';
            xx += suffix;

            $("#pie_chart").kendoChart({
                title: {
                    position: "bottom",
                    text: xx
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
                series: [{
                    type: "pie",
                    startAngle: 0,
                    data: [{
                        category: "MPPT",
                        value: (($scope.aggrGenData['MPPT'][idx] / $scope.aggrGenData['SUM'][idx])*100).toFixed(1),
                        color: "#C93030"
                    },{
                        category: "Absorption",
                        value: (($scope.aggrGenData['ABSORPTION'][idx] / $scope.aggrGenData['SUM'][idx])*100).toFixed(1),
                        color: "#FFF620"
                    },{
                        category: "Float",
                        value: (($scope.aggrGenData['FLOAT'][idx] / $scope.aggrGenData['SUM'][idx])*100).toFixed(1),
                        color: "#068c35"
                    },{
                        category: "Night",
                        value: (($scope.aggrGenData['NIGHT'][idx] / $scope.aggrGenData['SUM'][idx])*100).toFixed(1),
                        color: "#31440E"
                    }]
                }],
                tooltip: {
                    visible: true,
                    format: "{0}%"
                }
            });
            $('.k-tooltip').fadeTo(2000,0.7);

            var slider = $("#slider").data("kendoSlider");
            //slider.options.max = e.value * 1.1;
            //this works, but does not trigger angular model change
            //slider.value(20);
            var gauge = $("#gauge").data("kendoRadialGauge");
            gauge.options.scale.max = $("#genChart").data("kendoChart").options.valueAxis.max;


            $('#gaugeLabel').text(e.value+' '+suffix);
            $scope.sliderVal = e.value;
            gauge.redraw();
        }




        $scope.chartSettings = {
            type: 'line'
        };


    }]);


var valueAxes = [
    { name: "Battery Voltage", visible: false,
        title: { text: "Battery Voltage", visible: false}
    },
    { name: "Battery Current",
        title: { text: "Battery Current" }
    }
];


function createChart() {
//<div id="genChart" kendo-chart k-data-source="chartData" k-options="column"></div>
    $("#genChart").kendoChart({
        valueAxes: valueAxes
    });
};

