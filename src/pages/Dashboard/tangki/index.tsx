import React, { useState } from 'react';

// import FusionCharts from 'fusioncharts';
// import Charts from 'fusioncharts/fusioncharts.charts';
// // import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
// import ReactFC from 'react-fusioncharts';

import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
// import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
// import gammel from 'fusioncharts/themes/fusioncharts.theme.gammel';


import './DashTangki.scss'
import Icon from '@mdi/react';
import { mdiHome, mdiChartLine, mdiOrnament, mdiGradientHorizontal, mdiThumbsUpDown } from '@mdi/js';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import Card from 'react-bootstrap/esm/Card';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import { SVG_Circle } from '../../../assets'
import ReactApexChart from 'react-apexcharts';

import ThermometerFC from '../thermometer';
import CylinderFC from '../cylinder';

import { formatDate, postApi } from '../../../services/functions';
import { ApexOptions } from 'apexcharts';

import { Audio, Dna, ThreeCircles } from  'react-loader-spinner'
import Select from 'react-select'

import DatePicker from "react-datepicker";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
// import TimeRange from 'react-time-range';
import moment from 'moment';
// import { Form } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

// import tesaja from '../../../data/tes.json'

// ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme)
// ReactFC.fcRoot(FusionCharts, thermometer);

ReactFC.fcRoot(FusionCharts, Widgets, charts);

charts(FusionCharts);


class DashboardTangki extends React.Component {

    statusChecked:any = {
      tinggi: false,
      suhu: false
    }
    
    options_filter:any = [
      { value: 'date', label: 'Date' },
      { value: 'time', label: 'Date Time' }
    ];

    tanggal_max_tangki_last:any;
    // data JSON API
    arr_json_alldata:any = [];
    arr_json_tangki_last:any = {};
    // ... <end>

    props:any;

    // satuan meter
    mst_t_lubang_ukur:any = {
      'tangki_1':12.890,
      'tangki_2':12.856,
      'tangki_3':13.173,
      'tangki_4':13.183
    };

    // hitung tinggi minyak
    mst_t_tangki:any = {
      'tangki_1':12.483,
      'tangki_2':12.489,
      'tangki_3':12.830,
      'tangki_4':12.827,
    }

      // konstanta tinggi segitiga di atas tinggi tangki
    mst_avg_t_segitiga:any = {
      'tangki_1':0.49629,
      'tangki_2':0.71348,
      'tangki_3':0.54700,
      'tangki_4':0.47460,
    }
    // ... end


    mst_list_tangki = [
      {name:'tangki_1', api:'tank 1', bgColor:'bg-gradient-danger', title:'Tangki 1'},
      {name:'tangki_2', api:'tank 2', bgColor:'bg-gradient-info', title:'Tangki 2'},
      {name:'tangki_3', api:'tank 3', bgColor:'bg-gradient-success',title:'Tangki 3'},
      {name:'tangki_4', api:'tank 4', bgColor:'bg-gradient-warning',title:'Tangki 4'}
    ]

    // [
    //    {name:'Tangki 1', data:[31, 40, 28, 51]}
    // ]
    data_suhu_tangki_perjam_series:any = [];
    data_suhu_tangki_perjam_categories:any = [];

    data_tinggi_tangki_perjam_series:any = [];
    data_tinggi_tangki_perjam_categories:any = [];

    // chart 1 (Tinggi isi Tangki)
    setChartTinggi = {

        series: [{
          name: 'Tinggi Isi Tangki',
          data: []
        }], 

        options: {
          chart: {
            height: 350,
            type: 'bar',
            toolbar:{
              show:true,
              tools:{
                download:false,
              }
            },
            zoom:{
              enabled:false
            }
          },
          colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
              '#f48024', '#69d2e7'
          ],
          plotOptions: {
            bar: {
              borderRadius: 10,
              horizontal:false,
              distributed: false, // multicolor
              dataLabels: {
                position: 'top', // top, center, bottom
                // offsetX: 0,
                enabled:true,
                // enabledOnSeries: [1],
              },
            }
          },
          tooltip:{
            enabled:true
          },
          dataLabels: {
            enabled: true,
            formatter: (val:any) => {
              return val;
            },
            offsetY: 10,
            style: {
              fontSize: '12px',
              colors: ["#304758"]
            },
            background: {
                enabled: true,
                foreColor: '#ffff00',
                borderRadius: 2,
                padding: 4,
                opacity: 0.9,
                borderWidth: 1,
                borderColor: '#fff'
              },

            // textAnchor: 'end',
            
            dropShadow: {
                  enabled: true,
                  left: 1,
                  top: 2,
                  opacity: 0.3
              }          
          },
          
          xaxis: {
            // categories: ["Tangki 1", "Tangki 2", "Tangki 3", "Tangki 4"],
            categories:[],
            labels:{
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            position: 'top',
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 1,
                }
              },
              dropShadow: {
                  enabled: false,
                  top: 0,
                  left: 0,
                  blur: 1,
                  opacity: 0.4,
              },
            },
            tooltip: {
              enabled: true,
            }
          },
          yaxis: {
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: true,
            },
            labels: {
              show: true,
              formatter: (val:any) => {
                return val + " m";
              }
            }
          
          },
          title: {
            // text: 'Data Real Time',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
              color: '#444'
            }
          }
        },
    // ... end 
    }


    // contoh irregular Suhu Tangki (Jam)
    setChartSuhuJam_Irregular = {
      
      // series: [
      //   {
      //     name: 'Tangki 1',
      //     data: [31, 40, 28, 51, 42, 109, 100]
      //   }, 
      //   {
      //     name: 'Tangki 2',
      //     data: [11, 32, 45, 32, 34, 52, 41]
      //   },
      //   {
      //     name: 'Tangki 3',
      //     data: [15, 35, 70, 30, 45, 57, 47]
      //   },
      //   {
      //     name: 'Tangki 4',
      //     data: [17, 38, 95, 35, 39, 59, 43]
      //   },
      // ],
      // sini
      series: [
        {
          name: 'PRODUCT A',
          data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        }, {
          name: 'PRODUCT B',
          data: [
            { x: '2014-01-01 07:00', y: 30 }, 
            { x: '2014-01-01 09:00', y: 30 }, 
            { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        }, {
          name: 'PRODUCT C',
          data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        }
      ],

      options: {
        chart: {
          height: 350,
          stacked:false,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          // type: 'category',
          type: 'datetime',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          min: new Date("01/01/2014 05:00").getTime(),
          max: new Date("01/01/2014 19:00").getTime(),
          categories: [],
          labels:{
            formatter:(val:any)=>{
              return formatDate(new Date(val), 'HH:mm')
              // return val
            }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return val + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)
              // console.log(w.globals);

              return new Date(value)
              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
              //   return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any) => {
                return seriesName + " : "  // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuJam = {
      
      series: [
        // {
        //   name: 'Tangki 1',
        //   data: [31, 40, 28, 51, 42, 109, 100]
        // }, 
        // {
        //   name: 'Tangki 2',
        //   data: [11, 32, 45, 32, 34, 52, 41]
        // },
        // {
        //   name: 'Tangki 3',
        //   data: [15, 35, 70, 30, 45, 57, 47]
        // },
        // {
        //   name: 'Tangki 4',
        //   data: [17, 38, 95, 35, 39, 59, 43]
        // },
      ],
      // sini
      // series: [
      //   {
      //     name: 'PRODUCT A',
      //     data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      //   }, {
      //     name: 'PRODUCT B',
      //     data: [
      //       { x: '2014-01-01 07:00', y: 30 }, 
      //       { x: '2014-01-01 09:00', y: 30 }, 
      //       { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      //   }, {
      //     name: 'PRODUCT C',
      //     data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      //   }
      // ],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + "°C";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          // type: 'category',
          type: 'datetime',
          tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date("01/01/2014 05:00").getTime(),
          // max: new Date("01/01/2014 19:00").getTime(),
          // categories: [],

          labels:{
              rotate: -45,
              rotateAlways:true,
              formatter:(val:any)=>{
                return formatDate(new Date(val), 'HH:mm')
                // return val
              }
          //   formatDate(
          //     (new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000)
          // ,'HH:mm')
          }
        },
        yaxis:{
          labels:{
            formatter: (val:any)=>{ return parseInt(val) + " °C" }
          }
        },
        tooltip: {
          enabled:true,
          x: {
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)
              // console.log(w.globals);

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm')

              // let waktu:any = w.globals.categoryLabels[dataPointIndex];
                // return waktu;
            }
            // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
            //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            //     return ''
            // }
          },
          y: {
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(w.globals);
              return value + " °C"
            },
            title: {
              formatter: (seriesName:any) => {
                return seriesName + " : "  // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    // Volume Tangki (Jam)
    setChartVolumeJam = {
      
      series: [
        // {
        // name: 'Tangki 1',
        // data: [31, 40, 28, 51, 42, 109, 100]
        // }, 
        // {
        //   name: 'Tangki 2',
        //   data: [11, 32, 45, 32, 34, 52, 41]
        // },
        // {
        //   name: 'Tangki 3',
        //   data: [15, 35, 70, 30, 45, 57, 47]
        // },
        // {
        //   name: 'Tangki 4',
        //   data: [17, 38, 95, 35, 39, 59, 43]
        // },
      ],
      // series: [{
      //   name: 'PRODUCT A',
      //   data: [{ x: '01/01/2014 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      // }, {
      //   name: 'PRODUCT B',
      //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      // }, {
      //   name: 'PRODUCT C',
      //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
      // }],

      options: {
        chart: {
          height: 350,
          type: 'area',
          toolbar:{
            show:true,
            tools:{
              download:false,
            }
          },
          zoom:{
            enabled:false
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: (val:any) => {
            return val + " kg";
          },
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd MMM yy (HH:mm)'
          },
        },
      }
        
  // ... end 
    }


    chartTinggiJam_OptionsChart:ApexOptions = {
      chart: {
        type: 'area',
        // stacked: false,
        height: 350,
        toolbar:{
          show:true,
          tools:{
            download:false,
          //   zoomin:true,
          //   pan:true,
          //   reset:true,
          //   selection:true,
          //   zoom:true,
          //   zoomout:true
          }
        },
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false,
        formatter:(val:any)=>{
          return val + " m"
        }
        // style: {
        //   colors: ['#F44336', '#E91E63', '#9C27B0']
        // }
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          },
      },
      yaxis: {
        labels: {
            style: {
                colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: (val:any) => {
              // return (val / 1000000).toFixed(2);
              return (val);
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        }
      },
      xaxis: {
        type: 'datetime',
        // type: 'category',
        tickAmount:30,
        // categories:[],
        // categories:['2023-01-01 12:00:00','2023-01-01 13:00:00','2023-01-01 14:00:00'],
        // tickAmount: 24,
        // tickPlacement: 'on',
        // min: new Date("01/01/2014 05:00").getTime(),
        // max: new Date("01/01/2014 19:00").getTime(),
        labels: {
            rotate: -45,
            rotateAlways: true,
            formatter: (val:any) =>{
              return formatDate(new Date(val),'HH:mm')
                // return (formatDate(new Date(timestamp),'HH:mm'))
              // return moment(new Date(timestamp)).format("DD MMM YYYY")
            }
        }
      },
      title: {
        // text: 'Irregular Data in Time Series',
        align: 'left',
        offsetX: 14
      },
      tooltip: {
        shared: true
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    // Tinggi Isi Tangki (Jam) 
    setChartTinggiJam = {

      series: [
        // {
        //   name:'Tangki 1',
        //   data:[30,50,60]
        // },
        // {
        //   name:'Tangki 2',
        //   data:[70,30,90]
        // }

        // {
        //   name: 'Tangki 1',
        //   data: [{ x: '12/01/2013 06:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
        // }, {
        //   name: 'Tangki 2',
        //   data: [{ x: '01/01/2014 07:00', y: 30 }, { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
        // , {
        //   name: 'Tangki 3',
        //   data: [{ x: '01/01/2014 06:00', y: 15 }, { x: '01/01/2014 14:00', y: 25 } , { x: '01/01/2014 19:00', y: 40 }]
        // }
        // , {
        //   name: 'Tangki 4',
        //   data: [{ x: '01/01/2014 06:00', y: 20 }, { x: '01/01/2014 14:00', y: 35 } , { x: '01/01/2014 19:00', y: 45 }]
        // }
      ],
      options: {...this.chartTinggiJam_OptionsChart}
    }

    state:any = {
        dateSelected:new Date(),
        timeSelected:[null,null],
        show:{
          datepicker:false,
          timepicker:false
        },
        waktu:{
          tanggal:'',
          tanggal_jam:''
        },
        realtime:{
          tangki_1:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_2:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_3:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
          tangki_4:{
            tanggal:'',
            tanggal_jam:'',
            tinggi:'-',
            suhu:'-',
            volume:'-'
          },
        },

        loader:{
            tinggi_isi: true,
            tinggi_isi_jam: false,
            suhu_tangki: true,
            suhu_tangki_jam: false
        },
        chartTinggi:{...this.setChartTinggi},
        chartTinggiJam:{...this.setChartTinggiJam},
        chartSuhuJam:{...this.setChartSuhuJam},
        chartVolumeJam:{...this.setChartVolumeJam}
    };

    // chart termometer (fusionchart)
    // dataSource_Suhu = {

    //   chart: {
    //     caption: "Tangki 1",
    //     // subcaption: "(Real Time)",
    //     lowerlimit: "0",
    //     upperlimit: "100",
    //     numbersuffix: "°C",
    //     thmfillcolor: "#008ee4",
    //     showgaugeborder: "1",
    //     gaugebordercolor: "#008ee4",
    //     gaugeborderthickness: "2",
    //     plottooltext: "Temperature: <b>$datavalue</b> ",
    //     theme: "gammel",
    //     showvalue: "1",
    //     // "bgColor": "EEEEEE,CCCCCC",
    //     "bgColor": "ffffff",
    //     // "bgColor": "f0f8ff",
    //     // "borderColor": "#666666",
    //     "borderThickness": "4",
    //     // "borderAlpha": "80",
    //     showBorder:"0",
    //     thmFillColor: "#29C3BE",
    //     "showhovereffect": "1",
    //     "plotFillHoverColor": "ff0000",
    //     "baseFont": "Verdana",
    //     "baseFontSize": "8",
    //     // "baseFontColor": "#0066cc"
    //   },
    //   value: "0"
    // };
    // ... <end>

    // chartConfigs_Suhu = {
    //   type: 'thermometer',
    //   width: 150,
    //   height: 300,
    //   dataFormat: 'JSON',
    //   dataSource: this.dataSource_Suhu
    // };
    
  
    constructor(props:any){
        super(props)
        // this.buttonPlus = this.buttonPlus.bind(this);

        // start chart

        // this.state = {
        //     chartTinggi: {...setChartTinggi}
        // }
        // this.state = {
        //     // chartTinggi: {...setChartTinggi}
        //     // chartTinggi:  {
            
        //         series: [{
        //           name: 'Ketinggian Isi Tangki',
        //           data: [2.3, 3.1, 4.0, 10.1]
        //         }],
        //         options: {
        //           chart: {
        //             height: 350,
        //             type: 'bar',
        //           },
        //           plotOptions: {
        //             bar: {
        //               borderRadius: 20,
        //               dataLabels: {
        //                 position: 'top', // top, center, bottom
        //               },
        //             }
        //           },
        //           dataLabels: {
        //             enabled: true,
        //             formatter: (val:any) => {
        //               return val + "%";
        //             },
        //             offsetY: -20,
        //             style: {
        //               fontSize: '12px',
        //               colors: ["#304758"]
        //             }
        //           },
                  
        //           xaxis: {
        //             categories: ["Tangki 1", "Tangki 2", "Tangki 3", "Tangki 4"],
        //             position: 'top',
        //             axisBorder: {
        //               show: false
        //             },
        //             axisTicks: {
        //               show: false
        //             },
        //             crosshairs: {
        //               fill: {
        //                 type: 'gradient',
        //                 gradient: {
        //                   colorFrom: '#D8E3F0',
        //                   colorTo: '#BED1E6',
        //                   stops: [0, 100],
        //                   opacityFrom: 0.4,
        //                   opacityTo: 0.5,
        //                 }
        //               }
        //             },
        //             tooltip: {
        //               enabled: true,
        //             }
        //           },
        //           yaxis: {
        //             axisBorder: {
        //               show: false
        //             },
        //             axisTicks: {
        //               show: false,
        //             },
        //             labels: {
        //               show: false,
        //               formatter: (val:any) => {
        //                 return val + "%";
        //               }
        //             }
                  
        //           },
        //           title: {
        //             text: 'Monthly Inflation in Argentina, 2002',
        //             floating: true,
        //             offsetY: 330,
        //             align: 'center',
        //             style: {
        //               color: '#444'
        //             }
        //           }
        //         },
        //     // ... end 
            
        // }
        
    }

    buttonPlus(){

        this.setState({
            chartTinggi:{
                ...this.state.chartTinggi,
                options:{
                    ...this.state.chartTinggi.options,
                    plotOptions: {
                        ...this.state.chartTinggi.options.plotOptions,
                        bar: {
                            ...this.state.chartTinggi.options.plotOptions.bar,
                            borderRadius: 80,
                            dataLabels: {
                                position: 'bottom', // top, center, bottom
                            },
                        }
                    },
    
                }
            }
        })
    }


    update_to_arr_json_tangki_last(data_arr:any, ele:any, tangki_name:any, tangki_api:any){

        let findTank = Object.keys(data_arr).findIndex(res=>
          res.toLowerCase().indexOf(tangki_api) != -1
        );

        if (findTank != -1){
            let findIdx = Object.keys(this.arr_json_tangki_last).findIndex(res=>res == tangki_name);
            if (findIdx == -1){

                let sub_obj_keys = Object.keys(data_arr);
                sub_obj_keys.forEach((ele_for)=>{
                  if (ele_for.toLowerCase().indexOf(tangki_api) != -1){
                      // console.log(data_arr?.[ele_for])
                      // contoh tangki_name => 'tangki_4'
                      this.arr_json_tangki_last[tangki_name] = {
                          ...this.arr_json_tangki_last[tangki_name],
                          [ele_for]: data_arr?.[ele_for]
                      }
                  }
                })

                this.arr_json_tangki_last[tangki_name]['time'] = ele?.['time'];
                this.arr_json_tangki_last[tangki_name]['id_device'] = ele?.['id_device'];
                this.arr_json_tangki_last[tangki_name]['rawData'] = ele?.['rawData'];
            }
        }
    }

    async componentDidMount() {
        // this.setState({ 
        //   waktu:{
        //     tanggal:formatDate(new Date(),'DD MMMM YYYY'),
        //     tanggal_jam:formatDate(new Date(),'DD MMMM YYYY HH:mm:ss')
        //   }
        // })

        let length_mst_list_tangki:any = this.mst_list_tangki.length;

        // hit api yang getAllData
        // await postApi("https://platform.iotsolution.id:7004/api-v1/getAllData",null,true,(res:any)=>{
        await postApi("https://platform.iotsolution.id:7004/api-v1/getLastData",null,true,'1',null,(res:any)=>{
          
          if (res?.['responseCode'] == "200"){
              let res_data:any = res?.['data'];

              if (typeof res_data != 'undefined' && res_data != null){

                  // ambil data dengan id devices "BESTAGRO"
                  this.arr_json_alldata = [...
                      res_data.filter((res:any)=>{
                          if (typeof res?.['id_device'] != 'undefined' &&
                              res?.['id_device'] != null && 
                              res?.['id_device'].indexOf("BESTAGRO") != -1)
                          {
                              return true
                          }
                      })
                  ]

                  // isi data paling uptodate per tangki
                  this.arr_json_alldata.forEach((ele:any) => {
                      let data_arr:any = (ele?.['data']?.[0]);

                      // last tangki 4
                      console.log("ini element ")
                      console.log(ele)

                      for (let mst_list_tangki of this.mst_list_tangki){
                        // sample : update_to_arr_json_tangki_last (
                                          // ele?.['data']?.[0], 
                                          // {data:[{}], id_device:"BESTAGRO_002", rawData:"477|478|431|428|431|445|428|430|432|426|429|816", time:"2023-01-29 19:27:40" }
                                          // "tangki_4",
                                          // "tank 4"
                                    // )
                          
                          this.update_to_arr_json_tangki_last(data_arr, ele, mst_list_tangki?.['name'], mst_list_tangki?.['api']);
                      }


                      if (Object.keys(this.arr_json_tangki_last).length == length_mst_list_tangki){
                          return
                      }

                  });

                  console.log("array json tangki last")
                  console.log(this.arr_json_alldata)
                  console.log(this.arr_json_tangki_last);
              }
              
              this.kalkulasi_tinggi_tangki(()=>{
                this.kalkulasi_suhu_tangki(()=>{
                  this.kalkulasi_set_others_tangki();
                });
              });
          }
        })

        
        // dapatkan tanggal terakhir dari semua tangki yang ter-update
        this.getDateMax_From_TangkiLast();
        // untuk chart per jam
        // sini
        this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last);

        

        // alert(formatDate(new Date(),'HH:mm'))
        return
    }

    getDateMax_From_TangkiLast(){
        console.log("JSON TANGKI LAST")
        console.log(this.arr_json_tangki_last)

        let arr_time_timestamp:any[] = [];
        Object.keys(this.arr_json_tangki_last).forEach((ele:any)=>{
            let time_temp:any = new Date(this.arr_json_tangki_last?.[ele]?.['time']).getTime();
            arr_time_timestamp.push(time_temp)
        })

        this.tanggal_max_tangki_last = null;

        if (arr_time_timestamp.length > 0){

            console.log("TANGGAL MAX TANGKI LAST")
            console.log(arr_time_timestamp)
            this.tanggal_max_tangki_last = Math.max.apply(null, arr_time_timestamp)
            console.log(new Date(this.tanggal_max_tangki_last))
        }
    }

    async getAllData(datebegin:any, datelast:any, hourbegin?:any, hourlast?:any){

        // GET ALL DATA PER JAM (SUHU, TINGGI)
      // await postApi("https://platform.iotsolution.id:7004/api-v1/getAllData",null,true,'1',(res:any)=>{

      // await postApi("https://platform.iotsolution.id:7004/api-v1/getDataDate?sort=ASC",null,true,'1',
      // "dateBegin":formatDate(new Date(datebegin),'YYYY-MM-DD'),
      // "dateLast":formatDate(new Date(datelast),'YYYY-MM-DD')

      // LAGI FIXING PAK BAYU getDataHour banyak yg NaN
      await postApi("http://192.168.1.120:7004/api-v1/getDataHour?sort=ASC",null,true,'2',
        {
          "date":formatDate(new Date(datebegin),'YYYY-MM-DD'),
          "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '00:00' : hourbegin,
          "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '23:59' : hourlast,
          "minutes":true
        },
      (res:any)=>{
        
        console.log("post api await per jam")
        console.log(res)

        if (res?.['responseCode'] == "200"){

          let res_data:any = res?.['data'];

          if (typeof res_data != 'undefined' && res_data != null){

              // ambil data dengan id devices "BESTAGRO"
              this.arr_json_alldata = [...
                  res_data.filter((res:any)=>{
                      if (typeof res?.['id_device'] != 'undefined' &&
                          res?.['id_device'] != null && 
                          res?.['id_device'].indexOf("BESTAGRO") != -1)
                      {
                          return true
                      }
                  })
              ]

              // isi data suhu semua jam
              this.data_suhu_tangki_perjam_categories = [];
              
              let time_tank:any = '';
              let time_first:any = '';
              // loop json all data
              this.arr_json_alldata.forEach((ele:any, index:any) => {
                  let data_arr:any = (ele?.['data']?.[0]);

                  if (index == 0){
                    time_first = ele?.['time'] ?? '';
                  }

                  //2023-01-31 03:05:03
                  time_tank = ele?.['time'] ?? '';  
                  // let a = Date.parse(formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'));
                  // console.log(new Date(new Date(a).toUTCString()).getHours())

                  // untuk menampung data sementara per tangki
                  // perhitungan average suhu di lihat dari object ini
                  let obj_temp_tank:any = {}

                  let obj_keys_suhu = Object.keys(data_arr);

                  // LOOPING obj_keys_suhu (Object.keys(data_arr))
                  // console.log(data_arr)

                  obj_keys_suhu.forEach((ele_attr:any)=>{

                    // UPDATE SUHU TANGKI
                    let patt = new RegExp(/(Temperature Tank [0-9]+)/,'gi')
                    let patt_exec = patt.exec(ele_attr);

                    if (patt_exec != null){ 
                        // console.log("patt_exec temperature tank")
                        // patt_exec['input'] => Temperature Tank 1 BA tinggi 1 M
                        let data_temperature:any = patt_exec['input'];
                        // console.log(data_temperature)
                        // console.log(time_tank);

                        let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi')
                        let patt_tank_exec = patt_tank.exec(patt_exec[0])

                        if (patt_tank_exec != null){
                          // console.log("regexp")
                          // console.log(patt_tank_exec[0])
                          // patt_tank_exec[0] => Tank 1, Tank 2, dst...
                          let data_tank:any = patt_tank_exec[0];

                          if (patt_tank_exec[0] != null){

                              let nama_tangki:any = '';
                              let title_tangki:any = '';

                              let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                              if (find_mst_list){
                                
                                  nama_tangki = find_mst_list?.['name'] ?? '';
                                  title_tangki = find_mst_list?.['title'] ?? '';

                                  // push data temperature ke dalam variable obj_temp_tank

                                  obj_temp_tank[nama_tangki] = {
                                      ...obj_temp_tank[nama_tangki],
                                      title: title_tangki,
                                      tanggal: time_tank,
                                      tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                                      // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                      // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                      // tanggal_tz: new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000,
                                      // tanggal_tz: new Date(time_tank),
                                      data: obj_temp_tank[nama_tangki]?.['data'] == null ? 
                                            [data_arr?.[data_temperature]] 
                                            : [...obj_temp_tank[nama_tangki]?.['data'], data_arr?.[data_temperature]]
                                  }

                                  // console.log(new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000);
                                  // console.log(new Date(time_tank));
                                  // console.log(time_tank)

                                  // obj_temp_tank[nama_tangki]['data'].push(
                                  //   data_arr?.[data_temperature]
                                  // )
                                  // console.log(nama_tangki)
                              }
                          }
                        }

                    }
                    // ... <end SUHU TANGKI>

                    // UPDATE TINGGI MINYAK
                    let patt_tinggi = new RegExp(/(Jarak Sensor dengan permukaan Tank [0-9]+)/,'gi')
                    let patt_tinggi_exec = patt_tinggi.exec(ele_attr);
                    if (patt_tinggi_exec != null){

                        let data_jarak_sensor:any = patt_tinggi_exec['input'];

                        let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi')
                        let patt_tank_exec = patt_tank.exec(patt_tinggi_exec[0])
                        // console.log("PATT TANK EXEC")
                        // console.log(patt_tank_exec)

                        if (patt_tank_exec != null){
                            // console.log("regexp")
                            // console.log(patt_tank_exec[0])
                            // patt_tank_exec[0] => Tank 1, Tank 2, dst...
                            let data_tank:any = patt_tank_exec[0];

                            if (patt_tank_exec[0] != null){
                                let nama_tangki:any = '';
                                let title_tangki:any = '';

                                let tinggi_hitung:any = '';

                                let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                                if (find_mst_list){

                                      nama_tangki = find_mst_list?.['name'] ?? '';
                                      title_tangki = find_mst_list?.['title'] ?? '';

                                      // cari tinggi minyak
                                      let ruang_kosong:any = (data_arr?.[data_jarak_sensor] / 100) - this.mst_avg_t_segitiga?.[nama_tangki];

                                      tinggi_hitung = (this.mst_t_tangki?.[nama_tangki] - ruang_kosong).toFixed(3);
                                      // ... end tinggi minyak


                                      obj_temp_tank[nama_tangki] = {
                                          ...obj_temp_tank[nama_tangki],
                                          title: title_tangki,
                                          tanggal: time_tank,
                                          tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                                          // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                          // tanggal_tz: formatDate(new Date(time_tank),'YYYY-MM-DDTHH:mm:ss'),
                                          // tanggal_tz: new Date(time_tank).getTime() + new Date(time_tank).getTimezoneOffset() * 60000,
                                          // tanggal_tz: new Date(time_tank),
                                          data_jarak_sensor: data_arr?.[data_jarak_sensor],
                                          tinggi_minyak: tinggi_hitung
                                          // tinggi_minyak: data
                                          // data_jarak_sensor: obj_temp_tank[nama_tangki]?.['data_jarak_sensor'] == null ?
                                          //       [data_arr?.[data_jarak_sensor]]
                                          //       : [...obj_temp_tank[nama_tangki]?.['data_jarak_sensor'], data_arr?.[data_jarak_sensor]]
                                    }
                                }
                            }

                        }
                    }
                    // sampai sini

                    // LOOPING obj_keys_tinggi (Object.keys(data_arr))

                  })

                  // ... end LOOPING obj_keys_suhu (Object.keys(data_arr))

                  // console.log('OBJ temp tank')
                  // console.log(obj_temp_tank)

                  // hitung rata-rata tangki "obj_temp_tank"
                  let arr_obj_keys_avg = Object.keys(obj_temp_tank);
                  arr_obj_keys_avg.forEach((ele_tank_name:any) => {
                      let total:any = obj_temp_tank[ele_tank_name]['data'].reduce((tmp:any, val:any)=>{
                          return tmp + parseFloat(val);
                      },0)
                      let avg_tank:any = (total / obj_temp_tank[ele_tank_name]['data'].length).toFixed(3);
                      obj_temp_tank[ele_tank_name] = {
                          ...obj_temp_tank[ele_tank_name],
                          avg: avg_tank
                      }
                  });
                  // ... <end>
                  
                  // taruh hasil rata-rata nya ke data_suhu_tangki_per_jam
                  // looping obj_temp_tank
                  let obj_keys_obj_temp_tank:any = Object.keys(obj_temp_tank);
                  obj_keys_obj_temp_tank.forEach((tangki_name:any) => {

                    // START LOOPING
                      let data_temp:any = [];

                      let title_tangki:any = obj_temp_tank[tangki_name]['title'];
                      let tangki_exists:boolean = false;
                      let idx_arr_perjam_series:any = -1;

                      // SUHU TANGKI PER JAM
                      let findIdx:any = this.data_suhu_tangki_perjam_series.findIndex((res:any)=>res.name == obj_temp_tank[tangki_name]?.['title']);
                      if (findIdx != -1){
                          tangki_exists = true;
                          data_temp = [...this.data_suhu_tangki_perjam_series[findIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findIdx;
                      }

                      data_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['avg']),
                            x_time: new Date(time_tank).getTime()
                          }
                      );

                      // SORTING data_tinggi_temp
                      if (data_temp.length > 0) {

                        data_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }
                      // ... end sorting 

                      // store data ke "data_suhu_tangki_perjam_series" untuk nanti di simpan ke setChartSuhuJam
                      if (!tangki_exists){
                        this.data_suhu_tangki_perjam_series.push(
                            {name:title_tangki, data:[...data_temp]}
                        )
                      }else{
                          this.data_suhu_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_suhu_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_temp]
                          }
                      }
                      // ... end <SUHU TANGKI PER JAM>



                      // TINGGI TANGKI PER JAM
                      let data_tinggi_temp:any = [];

                      let tangki_tinggi_exists:boolean = false
                      let findTinggiIdx:any = this.data_tinggi_tangki_perjam_series.findIndex((res:any)=>res.name == obj_temp_tank[tangki_name]?.['title']);
                      if (findTinggiIdx != -1){
                          tangki_tinggi_exists = true;
                          data_tinggi_temp = [...this.data_tinggi_tangki_perjam_series[findIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findTinggiIdx;
                      }

                      data_tinggi_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['tinggi_minyak']),
                            x_time: new Date(time_tank).getTime()
                          }
                      );
                      // SORTING data_tinggi_temp
                      if (data_tinggi_temp.length > 0) {

                        data_tinggi_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }
                      // ... end sorting 

                      // console.log("DATA TINGGI TEMP")
                      // console.log(data_tinggi_temp)

                       // store data ke "data_tinggi_tangki_perjam_series" untuk nanti di simpan ke setChartTinggiJam
                       if (!tangki_exists){
                            this.data_tinggi_tangki_perjam_series.push(
                                {name:title_tangki, data:[...data_tinggi_temp]}
                            )
                        }else{
                            this.data_tinggi_tangki_perjam_series[idx_arr_perjam_series] = {
                                ...this.data_tinggi_tangki_perjam_series[idx_arr_perjam_series],
                                data: [...data_tinggi_temp]
                            }
                        }
                      // ... end <TINGGI TANGKI PER JAM>

                  });


                  // ... end obj_temp_tank

                  // push categories (tanggal tz ke array "data_suhu_tangki_perjam_categories")
                  // this.data_suhu_tangki_perjam_categories.push(time_tank);
                  // this.data_tinggi_tangki_perjam_categories.push(time_tank);

                  // REVISI UNTUK IRREGULAR SERIES ({x:..., y: ....})
                  this.data_suhu_tangki_perjam_categories.push(new Date(time_tank).getTime());
                  this.data_tinggi_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime()
                  );

                  
                  // reverse
                  // let temp_reverse = this.data_suhu_tangki_perjam_categories.reverse();
                  // this.data_suhu_tangki_perjam_categories = [...temp_reverse];
                  

                  // this.data_suhu_tangki_per_jam[]

                  // console.log("OBJ TEMP TANGKI")
                  // console.log(obj_temp_tank)

                  // console.log("ini element ")
                  // console.log(ele)

                  // for (let mst_list_tangki of this.mst_list_tangki){
                  //     alert(mst_list_tangki)
                  // }

              });
              // ... <end> json all data

              console.log("DATA SUHU TANGKI PER JAM SERIES")
              console.log(this.data_suhu_tangki_perjam_series)
              
              console.log("DATA TINGGI TANGKI PER JAM CATEGORIES")
              console.log(this.data_tinggi_tangki_perjam_categories)

              let min_tgl:any = null;
              let max_tgl:any = null;
              if (this.data_tinggi_tangki_perjam_categories.length > 0){
                  min_tgl = Math.min.apply(null, this.data_tinggi_tangki_perjam_categories)
                  max_tgl = Math.max.apply(null, this.data_tinggi_tangki_perjam_categories)
              }

              // SET CHART SUHU JAM
              this.setChartSuhuJam = {
                ...this.setChartSuhuJam,
                series: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_series)),
                options:{
                    ...this.setChartSuhuJam.options,
                    xaxis:{
                      ...this.setChartSuhuJam.options.xaxis,
                      type:'datetime',
                      // categories: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartSuhuJam.options.dataLabels,
                      enabled: this.statusChecked?.['suhu'] ?? false
                    }
                }
              }

              // SET CHART TINGGI JAM
              this.setChartTinggiJam = {
                ...this.setChartTinggiJam,
                series: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_series)),
                options:{
                    ...this.setChartTinggiJam.options,
                    xaxis:{
                      ...this.setChartTinggiJam.options.xaxis,
                      min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartTinggiJam.options.dataLabels,
                      enabled: this.statusChecked?.['tinggi'] ?? false
                    }
                }
              }

              // console.log("setChartSuhuJam")
              // console.log(this.setChartSuhuJam)

              this.setState({
                ...this.state,
                loader:{
                  ...this.state.loader,
                  suhu_tangki_jam: false,
                  tinggi_isi_jam: false
                },
                waktu:{
                    tanggal: formatDate(new Date(time_first),'DD MMMM YYYY'),
                    tanggal_jam: formatDate(new Date(time_first),'DD MMMM YYYY HH:mm:ss')
                },
                chartSuhuJam: {...this.setChartSuhuJam},
                chartTinggiJam: {...this.setChartTinggiJam}
              })

              // console.log("INI ADALAH TIME TANK")
              // console.log(time_tank)

              setTimeout(()=>{
                console.log("CHART TINGGI JAM")
                console.log(this.state.chartTinggiJam)

                console.log("set chart suhu jam")
                console.log(this.data_suhu_tangki_perjam_categories)
                console.log(min_tgl)
                console.log(max_tgl)
              },500)

              // console.log("array json tangki ALL DATA")
              // console.log(this.arr_json_alldata)
              // console.log(this.arr_json_tangki_last);
          }
        }
      })
    }

    kalkulasi_tinggi_tangki(callback:any){
        let obj_keys:any = Object.keys(this.arr_json_tangki_last);

        let arr_tangki_name:any = [];
        let arr_tangki_tinggi:any = [];

        if (obj_keys.length > 0){

          let temp_updatedState_tinggi:any = {};

            // inject dulu data dari this.state 
            temp_updatedState_tinggi['realtime'] = {

                ...this.state['realtime']
            }

            obj_keys.forEach((tangki_name:any) => {

                let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);
                let findJarakSensor = obj_keys_tangki.find((res:any)=>res.toLowerCase().indexOf("jarak sensor") != -1);
                if (findJarakSensor){

                    let time_json_tangki_last:any = this.arr_json_tangki_last[tangki_name]?.['time'];

                    let mst_t_lubang_ukur_temp = this.mst_t_lubang_ukur?.[tangki_name];

                    let mst_t_tangki_temp:any = this.mst_t_tangki?.[tangki_name];
                    let mst_avg_t_segitiga_temp:any = this.mst_avg_t_segitiga?.[tangki_name];

                    // JARAK SENSOR
                    let tangki_jarak_sensor:any =  this.arr_json_tangki_last?.[tangki_name]?.[findJarakSensor];
                    
                    
                    if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                        if (typeof tangki_jarak_sensor == 'string'){
                          tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                        }else{tangki_jarak_sensor = 0}
                    }else{tangki_jarak_sensor = 0}

                    let ruang_kosong_tangki:any = (tangki_jarak_sensor - mst_avg_t_segitiga_temp).toFixed(2);
                    let tinggi_minyak:any = (mst_t_tangki_temp - ruang_kosong_tangki).toFixed(2);

                    this.arr_json_tangki_last[tangki_name]['jarak_sensor'] = tinggi_minyak;

                    // taruh di temp dahulu, baru di store ke setState (karena setState tidak bisa update di looping multi data)
                    temp_updatedState_tinggi['realtime'] = {

                        ...temp_updatedState_tinggi['realtime'],
                        [tangki_name]: {
                            ...this.state.realtime[tangki_name],
                            tinggi: parseFloat(tinggi_minyak)
                        }
                    }
                    
                    // cari title tangki (Tangki 1, Tangki 2, dst...)
                    let find_tangki_title:any = this.mst_list_tangki.find(res_tank=>res_tank.name == tangki_name);
                    if (find_tangki_title){
                      let tanggal:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'DD MMMM YYYY');
                      let jam:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'HH:mm');

                      arr_tangki_name.push(
                          [find_tangki_title['title'], tanggal, jam]
                          // find_tangki_title['title']
                      );
                    }

                    arr_tangki_tinggi.push(parseFloat(tinggi_minyak));
                    // ... <end>
                  
                }

            })

              this.setState({
                ...this.state,
                loader:{
                    ...this.state.loader,
                    tinggi_isi:false
                },
                chartTinggi:{
                    ...this.state.chartTinggi,
                    options:{
                        ...this.state.chartTinggi.options,
                        xaxis:{
                          ...this.state.chartTinggi.options.xaxis,
                          categories: [...arr_tangki_name]    // ["Tangki 1","Tangki 2","Tangki 3","Tangki 4"]
                        }
                    },
                    series: [
                      {
                        data:[...arr_tangki_tinggi],  // [4.55, 8.81, ...]
                        name: "Tinggi Isi Tangki"}
                    ]
                },
                ...temp_updatedState_tinggi
                // realtime:{
                //     ...this.state.realtime,
                //     [tangki_name]:{
                //       ...this.state.realtime[tangki_name],
                //       tinggi: parseFloat(selisih_t_lubang_vs_jrk_sensor)
                //     }
                //   }
              })

              setTimeout(()=>{
                console.log("ini adalah state")
                console.log(this.state)
                callback()
              })
        }
    }

    kalkulasi_suhu_tangki(callback:any){

        let obj_keys:any = Object.keys(this.arr_json_tangki_last);

        let temp_arr:any = [];

        if (obj_keys.length > 0){

          let temp_updatedState_suhu:any = {};

          temp_updatedState_suhu['realtime'] = {

              ...this.state['realtime']
          }

            // loop
            obj_keys.forEach((tangki_name:any) => {
                
                let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);

                temp_arr = [];
                // cari ada kata "Temperature Tank"
                obj_keys_tangki.forEach((temperat:any)=>{
                    if (temperat.toLowerCase().indexOf("temperature tank") != -1){
                        temp_arr.push(parseFloat(this.arr_json_tangki_last[tangki_name][temperat]));
                    }
                })
                if (temp_arr.length > 0){

                    // di totalkan dulu
                    let total_temp_arr = temp_arr.reduce((acc:any, val:any)=>{
                        return acc + val
                    },0)
                    
                    // di rata-ratakan
                    let avg_temp_arr = (total_temp_arr / temp_arr.length).toFixed(2);

                    temp_updatedState_suhu['realtime'] = {
                        ...temp_updatedState_suhu['realtime'],
                        [tangki_name]: {
                          ...this.state['realtime'][tangki_name],
                          suhu: avg_temp_arr
                      }
                    }
                }
                
            })
            // ... <end loop>


              this.setState({
                ...this.state,
                loader:{
                  ...this.state.loader,
                  suhu_tangki:false
                },
                ...temp_updatedState_suhu
              })

              setTimeout(()=>{
                // console.log(temp_updatedState_suhu)
                console.log("(temp_updatedState_suhu) suhu tangki")
                console.log(temp_updatedState_suhu)
                console.log("(state) suhu tangki")
                console.log(this.state)
                callback()
              })
        }
    }

    kalkulasi_set_others_tangki(){
      let obj_keys:any = Object.keys(this.arr_json_tangki_last);

      let temp_arr:any = [];

      if (obj_keys.length > 0){

        let temp_updatedState_tanggal:any = {};

        temp_updatedState_tanggal['realtime'] = {

            ...this.state['realtime']
        }

          // loop
          obj_keys.forEach((tangki_name:any) => {
              
                // let obj_keys_tangki:any = Object.keys(this.arr_json_tangki_last?.[tangki_name]);

                temp_updatedState_tanggal['realtime'] = {

                    ...temp_updatedState_tanggal['realtime'],
                    [tangki_name]: {

                        ...this.state['realtime'][tangki_name],
                        tanggal: formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']), 'DD MMMM YYYY'),
                        tanggal_jam: formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']), 'DD MMMM YYYY HH:mm:ss')
                  }
                }
              
          })
          // ... <end loop>


            this.setState({
              ...this.state,
              ...temp_updatedState_tanggal
            })

            setTimeout(()=>{
              // console.log(temp_updatedState_suhu)
              console.log("temp_updatedState_tanggal")
              console.log(temp_updatedState_tanggal)
            })
      }
  }


  onChangeSelectFilter(e:any, action:any){
    if (action == 'clear'){
      this.setState({
        ...this.state,
        show:{
          ...this.state.show,
          datepicker:false,
          timepicker:false
        }
      }) 
      return
    }

    switch (e.value){
      case 'date':
            this.setState({
              ...this.state,
              show:{
                ...this.state.show,
                datepicker:true,
                timepicker:false
              }
            }) 
            break;
      case 'time':
            this.setState({
              ...this.state,
              show:{
                ...this.state.show,
                datepicker:true,
                timepicker:true
              }
            }) 
            break;
    }

    console.log(e.value)
  }

  setFilterDate(date:any){
      this.setState({
        dateSelected: date
      })
  }

  clickFilter(){
      let dateSelected:any = this.state.dateSelected;
      let timeSelected:any = this.state.timeSelected;
      
      if (this.state.show.datepicker || this.state.show.timepicker){
          if (dateSelected != null || timeSelected != null)
          {
            if (this.state.show.datepicker && !this.state.show.timepicker){

                this.data_suhu_tangki_perjam_series = []
                this.data_suhu_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_series = []

                this.setState({
                  ...this.state,
                  loader:{
                    ...this.state.loader,
                    tinggi_isi_jam: true,
                    suhu_tangki_jam: true
                  },
                });

                setTimeout(()=>{
                  this.getAllData(this.state.dateSelected, this.state.dateSelected)
                },200)
            }
            else
            {
              if (this.state.show.datepicker && this.state.show.timepicker){
                if (dateSelected != null && 
                        timeSelected[0] != null &&
                        timeSelected[1] != null){
                    
                    this.data_suhu_tangki_perjam_series = []
                    this.data_suhu_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_series = []

                    this.setState({
                      ...this.state,
                      loader:{
                        ...this.state.loader,
                        tinggi_isi_jam: true,
                        suhu_tangki_jam: true
                      },
                    });

                    setTimeout(()=>{
                      this.getAllData(dateSelected, dateSelected, timeSelected[0], timeSelected[1]);
                    },200)
                }
              }
            }


            console.log(dateSelected)
            console.log(timeSelected)
          }
      }
      else{
        // reset yang perjam
        this.data_suhu_tangki_perjam_series = []
        this.data_suhu_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_series = []

        this.setState({
          ...this.state,
          loader:{
            ...this.state.loader,
            tinggi_isi_jam: true,
            suhu_tangki_jam: true
          },
          // chartTinggiJam: {
          //   ...this.state.chartTinggiJam,
          //   series:[]
          // },
          // chartSuhuJam: {
          //   ...this.state.chartSuhuJam,
          //   series:[],
          //   options:{
          //     ...this.state.chartSuhuJam.options,
          //     xaxis:{
          //       ...this.state.chartSuhuJam.options.xaxis,
          //       categories:[]
          //     }
          //   }
          // }
        })

        setTimeout(()=>{
          console.log(this.state)
          this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last)
        },200)
      }
      
      
  }

  onChangeTimePicker(e:any){
      // alert(JSON.stringify(e))
      console.log(e)
      try{
        this.setState({
          timeSelected:[e[0], e[1]]
        })
      }catch(err:any){
        this.setState({
          timeSelected:[null, null]
        })
      }
  }
  onBlurTimePicker(e:any){
    console.log(e)
  }

  onStartTimeClick(e:any){
    alert(JSON.stringify(e))
  }

  checkChartJam(val:any, type:'tinggi'|'suhu_jam'){
    
    // console.log(val.target.checked)
    // if (val.target.checked){
      // this.chartTinggiJam_OptionsChart = {
      //   ...this.chartTinggiJam_OptionsChart,
      //   dataLabels:{
      //     ...this.chartTinggiJam_OptionsChart.dataLabels,
      //     enabled: val.target.checked
      //   }
      // }

      // this.setChartTinggiJam = {
      //   ...this.setChartTinggiJam,
      //   options:{...this.state.chartTinggiJam.options}
      // }

      if (type == 'tinggi'){
          this.statusChecked['tinggi'] = val.target.checked

          console.log('check chart JAM')
          console.log(this.state)
          this.setState({
            ...this.state,
            chartTinggiJam: {
                ...this.state.chartTinggiJam,
                options:{
                  ...this.state.chartTinggiJam.options,
                  xaxis:{
                    ...this.state.chartTinggiJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartTinggiJam.options.dataLabels,
                    formatter:(val:any)=>{
                      return val + " m"
                    },
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'suhu_jam'){
          this.statusChecked['suhu'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuJam: {
                ...this.state.chartSuhuJam,
                options:{
                  ...this.state.chartSuhuJam.options,
                  xaxis:{
                    ...this.state.chartSuhuJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
    // }
  }

    render(){
        return (
            <div>
              {/* <TimeRange
                  startMoment={this.state.startTime}
                  endMoment={this.state.endTime}
                  onChange={this.returnFunction}
              /> */}
              {/* <Row className='mt-5'>
                    <Col>
                      
                            <div className='d-flex justify-content-center'>
                                <button className='btn btn-sm btn-block btn-primary'
                                    onClick={()=>this.buttonPlus()}>Click sini</button>
                                    
                            </div>
                      
                    </Col>
              </Row> */}

                {/* <Container className='dashtangki-contain-wrapper' fluid> */}
              

                
                    <div className='dashtangki-contain-wrapper'>
                        <div className='dashtangki-subcontain'>
                                <Row className='dashtangki-row-1'>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <h3 className='dashtangki-page-title'>
                                                    <span className='bg-gradient-primary dashtangki-mdi-span'>
                                                        <Icon path={mdiHome} size={0.7} color= "white" className='good'/>
                                                    </span>
                                                    Dashboard
                                                </h3>
                                            </Col>
                                        </Row>

                                        {/* <Row className='mt-5'>
                                            <Col>
                                                <div><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div>
                                            </Col>
                                        </Row> */}
                                        
                                        <Row className='mt-5 d-flex flex-nowrap customclass-snap'>
                                              {
                                                  this.mst_list_tangki.map((ele, idx)=>{
                                                    return (
                                                      <Col className='snap-col' key={ele.name} style={{marginBottom:'10px'}}>
                                                          
                                                          <Card className={ele.bgColor}>
                                                              <Card.Body className='mb-3'>
                                                                  <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                                  <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                                      {ele.title}
                                                                      <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                                  </h4>
                                                                  <div className  ='dashtangki-subtitle-card mb-3'>
                                                                      {
                                                                        typeof this.state.realtime?.[ele.name]?.['tanggal_jam'] != 'undefined' && 
                                                                            this.state.realtime?.[ele.name]?.['tanggal_jam'] != '' &&
                                                                            this.state.realtime?.[ele.name]?.['tanggal_jam'] != null 
                                                                            ?
                                                                            
                                                                              <span className='dashtangki-subtitle text-white'>
                                                                                    ({this.state.realtime?.[ele.name]?.['tanggal_jam']})
                                                                              </span>
                                                                            :
                                                                              <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                              </div>
                                                                      }
                                                                  </div>

                                                                  <h4 className='text-white'>Tinggi : {this.state.realtime?.[ele.name].tinggi} M</h4>
                                                                  <h4 className='text-white'>Suhu : {this.state.realtime?.[ele.name].suhu} °C</h4>
                                                                  <h4 className='text-white'>Volume : {this.state.realtime?.[ele.name].volume} kg</h4>

                                                              </Card.Body>
                                                          </Card>
                                                      </Col>
                                                      )
                                                  })
                                              }
                                        </Row>

                                        {/* <Row className='mt-1 d-flex flex-nowrap customclass-snap'>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-danger'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 1
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_1']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_1']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_1']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_1']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_1.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_1.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_1.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-info'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 2
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_2']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_2']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_2']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_2']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_2.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_2.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_2.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-success'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 3
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                            {
                                                              typeof this.state.realtime?.['tangki_3']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_3']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_3']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_3']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                            }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_3.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_3.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_3.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col className='snap-col'>
                                                <Card className='bg-gradient-warning'>
                                                    <Card.Body className='mb-3'>
                                                        <img src = {SVG_Circle} className="dashtangki-image-circle" />
                                                        <h4 className='text-white dashtangki-cardbody-ontop d-flex justify-content-between'>
                                                            Tangki 4
                                                            <Icon path={mdiChartLine} size = {1} className="float-right" />
                                                        </h4>
                                                        <div className  ='dashtangki-subtitle-card mb-3'>
                                                          {
                                                              typeof this.state.realtime?.['tangki_4']?.['tanggal_jam'] != 'undefined' && 
                                                                  this.state.realtime?.['tangki_4']?.['tanggal_jam'] != '' &&
                                                                  this.state.realtime?.['tangki_4']?.['tanggal_jam'] != null 
                                                                  ?
                                                                    <span className='dashtangki-subtitle text-white'>
                                                                          ({this.state.realtime?.['tangki_4']?.['tanggal_jam']})
                                                                    </span>
                                                                  :
                                                                    <div className='dashtangki-subtitle text-white' style={{height:'24px'}}>  
                                                                    </div>
                                                          }
                                                        </div>

                                                        <h4 className='text-white'>Tinggi : {this.state.realtime.tangki_4.tinggi} M</h4>
                                                        <h4 className='text-white'>Suhu : {this.state.realtime.tangki_4.suhu} °C</h4>
                                                        <h4 className='text-white'>Volume : {this.state.realtime.tangki_4.volume} ltr</h4>

                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                        </Row> */}

                                        <Row className='mt-5'>
                                            <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m )</h5>
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}
                                            <Col>
                                                <div id="chart" className='d-flex justify-content-center align-items-center'>
                                                    {/* <Audio
                                                      height="150"
                                                      width="150"
                                                      color="red"
                                                      ariaLabel="audio-loading"
                                                      wrapperStyle={{}}
                                                      wrapperClass="wrapper-class"
                                                      visible={this.state.loader.tinggi_isi}
                                                    /> */}
                                                    <ThreeCircles
                                                        height="100"
                                                        width="100"
                                                        color="#4fa94d"
                                                        wrapperStyle={{}}
                                                        wrapperClass=""
                                                        visible={this.state.loader.tinggi_isi}
                                                        ariaLabel="three-circles-rotating"
                                                        outerCircleColor=""
                                                        innerCircleColor=""
                                                        middleCircleColor=""
                                                      />

                                                    {/* <Dna
                                                      height = "200"
                                                      width = "200"
                                                      ariaLabel = 'dna-loading'
                                                      wrapperStyle={{}}
                                                      wrapperClass="wrapper-class"
                                                      visible={this.state.loader.tinggi_isi}
                                                    /> */}

                                                    { 
                                                      !this.state.loader.tinggi_isi &&
                                                        (<div className='w-100'>
                                                          <ReactApexChart 
                                                                  options={this.state.chartTinggi.options} 
                                                                  series={this.state.chartTinggi.series} 
                                                                  type="bar" height={350}
                                                          />
                                                        </div>)
                                                    }

                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className='mt-3'>
                                            <h5 className='dashtangki-title'>Suhu Tangki ( °C )</h5>
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}

                                            {this.state.loader.suhu_tangki && 
                                                (
                                                  <div>
                                                      <Col className='d-flex justify-content-center w-100'>
                                                        <ThreeCircles
                                                              height="100"
                                                              width="100"
                                                              color="#4fa94d"
                                                              wrapperStyle={{}}
                                                              wrapperClass=""
                                                              visible={this.state.loader.suhu_tangki}
                                                              ariaLabel="three-circles-rotating"
                                                              outerCircleColor=""
                                                              innerCircleColor=""
                                                              middleCircleColor=""
                                                        />
                                                      </Col>
                                                  </div>
                                                )
                                            }

                                            <Col className='d-flex justify-content-start flex-nowrap customclass-snap'>
                                                {/* <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/> */}


                                               
                                                {
                                                   !this.state.loader.suhu_tangki && 
                                                      this.mst_list_tangki.map((ele,idx)=>{
                                                        return (
                                                          <div className='snap-col' key = {ele.name}>
                                                            <ThermometerFC caption = {ele.title} 
                                                                      subcaption2={this.state.realtime?.[ele.name]?.['tanggal_jam']}
                                                                      subcaption={this.state.realtime?.[ele.name]?.['tanggal']} 
                                                                      value={this.state.realtime?.[ele.name]?.['suhu']}/>
                                                          </div>
                                                        )
                                                      })
                                                } 

                                                {/* <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 2" value={50}/>
                                                </div>
                                                <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 3" value={80}/>
                                                </div>
                                                <div className='snap-col'>
                                                    <ThermometerFC caption = "Tangki 4" value={25}/>
                                                </div> */}

                                                {/* <ReactFusioncharts
                                                    type="thermometer"
                                                    width="100%"
                                                    height="100%"
                                                    dataFormat="JSON"
                                                    dataSource={dataSource}
                                                  /> */}
                                            </Col>
                                      </Row>

                                        <Row className='mt-4'>
                                            <h5 className='dashtangki-title'>Volume Tangki ( kg )</h5>
                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div>

                                            <Col className='d-flex flex-nowrap customclass-snap'>
                                                {/* <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/> */}
                                                {
                                                  this.mst_list_tangki.map((ele,idx)=>{
                                                    return (
                                                      <div className='snap-col' key = {ele.name}>
                                                        <CylinderFC caption = {ele.title} value={this.state.realtime?.[ele.name]?.['volume']} plottooltext_hover="Volume"/>
                                                      </div>
                                                    )
                                                  })
                                                } 
                                                  
                                                {/* <div className='snap-col'>
                                                    <CylinderFC caption = "Tangki 2" value={4774841.53} plottooltext_hover="Volume"/>
                                                </div>
                                                <div className='snap-col'>
                                                    <CylinderFC caption = "Tangki 3" value={0} plottooltext_hover="Volume"/>
                                                </div>
                                                <div className='snap-col'>
                                                    <CylinderFC caption = "Tangki 4" value={3028794.28} plottooltext_hover="Volume"/>
                                                </div> */}

                                                {/* <ReactFusioncharts
                                                    type="thermometer"
                                                    width="100%"
                                                    height="100%"
                                                    dataFormat="JSON"
                                                    dataSource={dataSource}
                                                  /> */}
                                            </Col>
                                        </Row>


                                        <Row className='mt-5'>
                                            {/* <hr></hr> */}
                                            <Col> 
                                                <div className='d-flex justify-content-start align-items-center'> 
                                                    <div className='filter-css-title'>Filter : </div>
                                                    <Select options={this.options_filter} 
                                                        className="select-class"
                                                        tabSelectsValue={false} isClearable={true}
                                                        onChange={(e, {action})=>this.onChangeSelectFilter(e, action)}
                                                    />

                                                    {
                                                      this.state.show.datepicker && 
                                                        <DatePicker 
                                                          dateFormat="dd MMMM yyyy"
                                                          selected={this.state.dateSelected} 
                                                          onChange={(date) => this.setFilterDate(date)}
                                                        />
                                                    }

                                                    {
                                                      this.state.show.timepicker && 
                                                        // <TimeRange 
                                                        //         onChange={(e)=>{this.onChangeTimePicker(e)}} 
                                                        //         onStartTimeChange={(e)=>{this.onStartTimeClick(e)}}
                                                        //         startMoment={this.state.timeSelected.startMoment} 
                                                        //         endMoment={this.state.timeSelected.endMoment} 
                                                        // />
                                                        <TimeRangePicker 
                                                          locale="id"
                                                          minTime="00:00:00"
                                                          maxTime="23:59:59"
                                                          minutePlaceholder="mm"
                                                          hourPlaceholder="hh"
                                                          required={true}
                                                          onChange={(e)=>{this.onChangeTimePicker(e)}} value={this.state.timeSelected}
                                                          onBlur={(e)=>{this.onBlurTimePicker(e)}}/>
                                                    }

                                                    <div className='btn-filter-ml'>
                                                      <button className='btn btn-sm btn-primary' onClick={()=>this.clickFilter()}>Filter</button>
                                                    </div>

                                                </div>
                                            </Col>

                                            {/* <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m / jam )</h5> */}
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div> */}
                                        </Row>

                                        <Row className='mt-2'>
                                            <hr></hr>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m / jam )</h5>
                                                    <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                </div>
                                                <div>
                                                        {/* <Form.Check
                                                          inline
                                                          label="1"
                                                          name="group1"
                                                          type='checkbox'
                                                          id={`inline-${'1'}-1`}
                                                        /> */}
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input type={'checkbox'} onChange={(val)=>{this.checkChartJam(val,'tinggi')}}/>
                                                            <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                            {/* <Form.Control.Feedback type="valid">
                                                              You did it! 
                                                            </Form.Control.Feedback> */}
                                                        </Form.Check>
                                                </div>


                                            </div>

                                            <Col> 
                                                <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                   <ThreeCircles
                                                        height="100"
                                                        width="100"
                                                        color="#4fa94d"
                                                        wrapperStyle={{}}
                                                        wrapperClass=""
                                                        visible={this.state.loader.tinggi_isi_jam}
                                                        ariaLabel="three-circles-rotating"
                                                        outerCircleColor=""
                                                        innerCircleColor=""
                                                        middleCircleColor=""
                                                    />

                                                    { 
                                                        !this.state.loader.tinggi_isi_jam &&
                                                        <div className='w-100'>
                                                            <ReactApexChart 
                                                                  options={this.state.chartTinggiJam.options} 
                                                                  series={this.state.chartTinggiJam.series} 
                                                                  type="area" 
                                                                  height={350} />
                                                        </div>
                                                    }

                                                    
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className='mt-3'>
                                            <hr></hr>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <h5 className='dashtangki-title'>Suhu Tangki ( °C / jam )</h5>
                                                    <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                </div>
                                                <div>
                                                    <Form.Check type={'checkbox'} inline>
                                                        <Form.Check.Input type={'checkbox'} onChange={(val)=>{this.checkChartJam(val,'suhu_jam')}}/>
                                                        <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                        {/* <Form.Control.Feedback type="valid">
                                                          You did it! 
                                                        </Form.Control.Feedback> */}
                                                    </Form.Check>
                                                </div>
                                            </div>

                                            <Col> 
                                                <div id="chart" className='d-flex justify-content-center'>

                                                    <ThreeCircles
                                                        height="100"
                                                        width="100"
                                                        color="#4fa94d"
                                                        wrapperStyle={{}}
                                                        wrapperClass=""
                                                        visible={this.state.loader.suhu_tangki_jam}
                                                        ariaLabel="three-circles-rotating"
                                                        outerCircleColor=""
                                                        innerCircleColor=""
                                                        middleCircleColor=""
                                                    />

                                                    { 
                                                        !this.state.loader.suhu_tangki_jam &&
                                                        <div className='w-100'>
                                                            <ReactApexChart options={this.state.chartSuhuJam.options} 
                                                                  series={this.state.chartSuhuJam.series} 
                                                                  type="area" 
                                                                  height={350} />
                                                        </div>
                                                    }

                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className='mt-3'>
                                            <h5 className='dashtangki-title'>Volume Tangki ( kg / jam )</h5>
                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                            <Col> 
                                                <div id="chart">
                                                    <ReactApexChart options={this.state.chartVolumeJam.options} series={this.state.chartVolumeJam.series} type="area" height={350} />
                                                </div>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>                                

                        </div>
                    </div>
                

                {/* </Container> */}
                
            </div>
        
        )
    }
}

export default DashboardTangki;