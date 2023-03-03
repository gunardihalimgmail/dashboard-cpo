import React, { createRef, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print'
// import ReactExport from 'react-export-excel-xlsx-fix'
import ReactExport from 'react-export-excel-xlsx-fix'

import _ from 'lodash'

// amCharts
import * as am5 from "@amcharts/amcharts5";
import * as am5xy  from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// ... end amCharts

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
import { mdiHome, mdiChartLine, mdiOrnament, mdiGradientHorizontal, mdiThumbsUpDown, mdiConsoleNetworkOutline, mdiFolderHome, mdiViewDashboard, mdiViewDashboardVariant, mdiMonitorDashboard, mdiChartAreaspline, mdiChartAreasplineVariant, mdiChartDonutVariant, mdiChartBarStacked, mdiCogSyncOutline } from '@mdi/js';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import Card from 'react-bootstrap/esm/Card';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import { BlueWavyCurve, Img_Facebook, MotionSensor, MotionSensorRed, No_Found, SVG_Circle, Tank, TermSensor, Thermometer, WeightTank } from '../../../assets'
import ReactApexChart from 'react-apexcharts';

import ThermometerFC from '../thermometer';
import CylinderFC from '../cylinder';

import { formatDate, notify, postApi, postApiSync } from '../../../services/functions';
import { ApexOptions } from 'apexcharts';

import { Audio, Dna, ThreeCircles } from  'react-loader-spinner'
import Select from 'react-select'

import DatePicker from "react-datepicker";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
// import TimeRange from 'react-time-range';
import moment from 'moment';
// import { Form } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import tangki_1_json from '../../../data/volume_tangki/tangki_1.json'
import tangki_2_json from '../../../data/volume_tangki/tangki_2.json'
import tangki_3_json from '../../../data/volume_tangki/tangki_3.json'
import tangki_4_json from '../../../data/volume_tangki/tangki_4.json'
import berat_jenis_cpo_json from '../../../data/volume_tangki/berat_jenis_cpo.json'
import berat_jenis_pko_json from '../../../data/volume_tangki/berat_jenis_pko.json'
import { toast, ToastContainer } from 'react-toastify';
import { FALSE } from 'sass';
// import tesaja from '../../../data/tes.json'

// ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme)
// ReactFC.fcRoot(FusionCharts, thermometer);

ReactFC.fcRoot(FusionCharts, Widgets, charts);

charts(FusionCharts);

// column 3d

const dataSource = {
  chart: {
    // caption: "Countries with Highest Deforestation Rate",
    // subcaption: "For the year 2017",
    // yaxisname: "Deforested Area{br}(in Hectares)",
    thmFillColor: "#ff0000",
    decimals: "9",
    theme: "fusion"
  },
  data: [
    {
      label: "Brazil",
      value: "1466000"
    },
    {
      label: "Indonesia",
      value: "1147800"
    },
    {
      label: "Russian Federation",
      value: "532200"
    },
    {
      label: "Mexico",
      value: "395000"
    },
    {
      label: "Papua New Guinea",
      value: "250200"
    },
    {
      label: "Peru",
      value: "224600"
    },
    {
      label: "U.S.A",
      value: "215200"
    },
    {
      label: "Bolivia",
      value: "135200"
    },
    {
      label: "Sudan",
      value: "117807"
    },
    {
      label: "Nigeria",
      value: "82000"
    },

  ]
};
// ... <end> column 3d

;

class PanggilToast extends React.Component { 
  render(){
    return (
      <div style={{color:'red'}}>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit dignissimos soluta sapiente consectetur ad temporibus. Necessitatibus, eius minus placeat fuga sed enim aliquid molestias totam consectetur aut? Itaque perferendis quia ratione consectetur explicabo! Eum dolorum molestiae, animi, soluta quo temporibus accusantium magnam itaque consequuntur autem, minima quasi optio esse. Sunt nihil ex, sit tenetur, quasi nobis hic officiis earum reprehenderit animi harum, quos cumque unde incidunt eaque corporis provident ipsum ea quisquam natus laborum. Ut hic expedita sequi! Deserunt, dolorum aperiam! Maiores, est molestias neque nisi ipsa, consequuntur necessitatibus maxime numquam ut inventore quis similique dolorem repellat minima. Placeat, expedita. </div>
      </div>
    )
  }
}

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class DashboardTangki extends React.Component {
    
    data_Export:any = [];
    
    componentRef:any;
  
    chart:any; // untuk Chart Tinggi isi (AM Chart)

    root:any;
    chart_amColumn3d:any;

    getFirstTangki_Default:any = {};

    arr_tangki_last_from_dataHour:any = {};

  // ARRAY CPO & PKO berdasarkan tanggal berlaku
    arr_cpo_pko = [
      {name: 'tangki_1', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:'2023-02-20 23:59'},
      {name: 'tangki_1', jenis:'PKO', datebegin:'2023-02-21 00:00', datelast:''},

      {name: 'tangki_2', jenis:'PKO', datebegin:'1970-01-01 00:00', datelast:''},

      {name: 'tangki_3', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:'2023-01-27 23:59'},
      {name: 'tangki_3', jenis:'PKO', datebegin:'2023-01-28 00:00', datelast:'2023-02-03 23:59'},
      {name: 'tangki_3', jenis:'CPO', datebegin:'2023-02-04 00:00', datelast:''},

      {name: 'tangki_4', jenis:'CPO', datebegin:'1970-01-01 00:00', datelast:''},
    ]

    statusChecked:any = {
      jarak_sensor: true,
      tinggi: true,
      tinggi_modus: true,
      suhu: true,
      suhu_modus: true,
      suhu_tinggi: true,
      volume: false
    }
    
    options_filter:any = [
      { value: 'date', label: 'Date' },
      { value: 'time', label: 'Date Time' }
    ];

    tanggal_max_tangki_last:any;
    // data JSON API
    arr_json_alldata:any = [];
    arr_json_tangki_last:any = {};
    arr_date_realtime:any = [];
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
      // new => rata-rata sampai 24 Jan '23 - 10 feb 2023

    mst_avg_t_segitiga:any = {
      'tangki_1':0.4030,   // 0.49629 (prev old -> new) tgl 21 feb '23
      'tangki_2':0.6946,   // 0.71348, 0.70074, 0.69876, 0.69818, 0.69460, 0,6917, 0.6946 (prev) => TGL DIPAKAI *10 FEB - 21 FEB '23
      'tangki_3':0.4890,   // 0.54700, 0.48733, 0.48870  (prev) => TGL DIPAKAI *10 FEB '23 - 16 FEB '23
      'tangki_4':0.4734,   // 0.47460, 0.47229, 0.46792, 0.47070, 0.46650, 0.4708 (prev) => TGL DIPAKAI *10 feb '23 - 16 feb '23
    }

    // ... end


    // value & label untuk options filter pada suhu tinggi tangki
    mst_list_tangki = [
      {name:'tangki_1', api:'tank 1', bgColor:'bg-gradient-danger', title:'Tangki 1', value:'Tangki 1', label: 'Tangki 1'},
      {name:'tangki_2', api:'tank 2', bgColor:'bg-gradient-info', title:'Tangki 2', value:'Tangki 2', label: 'Tangki 2'},
      {name:'tangki_3', api:'tank 3', bgColor:'bg-gradient-success',title:'Tangki 3', value:'Tangki 3', label: 'Tangki 3'},
      {name:'tangki_4', api:'tank 4', bgColor:'bg-gradient-warning',title:'Tangki 4', value:'Tangki 4', label: 'Tangki 4'}
    ]

    // [
    //    {name:'Tangki 1', data:[31, 40, 28, 51]}
    // ]
    data_jaraksensor_tangki_perjam_series:any = [];
    data_jaraksensor_tangki_perjam_categories:any = [];
    
    data_suhu_tangki_perjam_series:any = [];
    data_suhu_tangki_perjam_categories:any = [];

    data_tinggi_tangki_perjam_series:any = [];
    data_tinggi_tangki_perjam_categories:any = [];
    
    data_volume_tangki_perjam_series:any = [];
    data_volume_tangki_perjam_categories:any = [];

    // sample : 
    // { tangki_1: [{name:'1 M', data:[{x: '2022-01-01 06:00', y: 465 }]}]}
    obj_suhu_tinggi_tangki_perjam_series:any = {};
      

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
              columnWidth:'90%',
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
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: "horizontal",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 0.85,
              opacityTo: 0.85,
              stops: [50, 80, 100]
            },
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

      statusFound: false,
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
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
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
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

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
              formatter: (seriesName:any, {series, seriesIndex, dataPointIndex, w }:any) => {
                // console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'])
                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '') 
                      + ' : '
                        // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuModusJam = {

      statusFound: false,
      series: [
      ],
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
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
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
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

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
              formatter: (seriesName:any, {series, seriesIndex, dataPointIndex, w }:any) => {
                // console.log(w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'])
                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '') 
                      + ' : '
                        // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    setChartSuhuTinggiJam = {

      statusFound: false,
      isDisabled: true,
      suhuTinggiSelected:{},
      series: [
      ],
      // series: [
      //   {
      //     name: '1 M',
      //     data: [{ x: '2014-01-01 05:00', y: 54 }, { x: '01/01/2014 14:00', y: 60 } , { x: '01/01/2014 19:00', y: 70 }]
      //   }, {
      //     name: '3 M',
      //     data: [
      //       { x: '2014-01-01 07:00', y: 30 }, 
      //       { x: '2014-01-01 09:00', y: 30 }, 
      //       { x: '01/01/2014 15:00', y: 40 } , { x: '01/01/2014 19:00', y: 45 }]
      //   }, {
      //     name: '5 M',
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
          type: 'datetime',
          // type: 'category',
          // tickAmount:30,
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          // min: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).getTime(),
          // max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).getTime(),
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
            show:true,
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
              // console.log(series)
              // console.log(seriesIndex)
              // console.log(dataPointIndex)

              // return new Date(value)
              return formatDate(new Date(value),'HH:mm:ss')

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
              formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                // console.log(w.globals.initialSeries)

                return seriesName + " : "
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                    // nama series pada tooltip sewaktu di hover
              }
            },
          }
        },
      }
        
  // ... end 
    }

    // Volume Tangki (Jam)
    setChartVolumeJam = {

      statusFound: false,
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
        yaxis: {
          labels: {
              style: {
                  colors: '#8e8da4',
              },
              offsetX: 0,
              formatter: (val:any) => {
                // return (val / 1000000).toFixed(2);
                // return parseFloat(val?.toFixed(3)) + " kg";
                return Math.round(parseFloat(val)*1000)/1000 + " kg";
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
          labels: {
              rotate: -45,
              rotateAlways: true,
              formatter: (val:any) =>{
                return formatDate(new Date(val),'HH:mm')
                  // return (formatDate(new Date(timestamp),'HH:mm'))
                // return moment(new Date(timestamp)).format("DD MMM YYYY")
              }
          }
          // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
          x: {
            format: 'dd MMM yy (HH:mm)',
            formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {
  
              return formatDate(new Date(value),'HH:mm:ss')
            }
          },
          y: {
            title: {
              formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

                // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                // console.log(w.globals.initialSeries)

                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
                    // nama series pada tooltip sewaktu di hover
              }
            },
          }
        }
      }
        
  // ... end 
    }


    chartTinggiJam_OptionsChart = {
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
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) ? ((Math.round(val * 1000)/1000) + " m") : ''
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
              return (Math.round(parseFloat(val)*1000)/1000) + " m";
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
        // tickAmount:0,
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
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
            title:{
              formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

                let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
              },
            }
        }
        // y: {
        //     title: {
        //       formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

        //         let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
        //         // console.log(w.globals.initialSeries)

        //         return seriesName
        //               + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
        //               ? ' (' + jenis_tmp + ')'
        //               : '')
        //               + ' : '
        //             // nama series pada tooltip sewaktu di hover
        //       }
        //     },
        // }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    chartTinggiJam_Modus_OptionsChart = {
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
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) ? ((Math.round(parseFloat(val)*1000)/1000) + " m") : ''
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
              return (Math.round(parseFloat(val)*1000)/1000) + " m";
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
        // tickAmount:0,
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
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
            title:{
              formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

                let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
                return seriesName
                      // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                      // ? ' (' + jenis_tmp + ')'
                      // : '')
                      + ' : '
              },
            }
        }
        // y: {
        //     title: {
        //       formatter: (seriesName:any, { series, seriesIndex, dataPointIndex, w }:any) => {

        //         let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
        //         // console.log(w.globals.initialSeries)

        //         return seriesName
        //               + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
        //               ? ' (' + jenis_tmp + ')'
        //               : '')
        //               + ' : '
        //             // nama series pada tooltip sewaktu di hover
        //       }
        //     },
        // }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    // chartJarakSensorJam_OptionsChart:ApexOptions = {
    chartJarakSensorJam_OptionsChart = {
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
        enabled: true,
        formatter:(val:any)=>{
          return !isNaN(val) && val != null ? ((Math.round(val*1000)/1000).toString() + " m") : ''
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
              return parseFloat(val?.toFixed(3)) + " m";
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
        // tickAmount:0,
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
              return formatDate(new Date(val),'HH:mm:ss')
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
        shared: true,
        x: {
          show:true,
          format: 'dd MMM yy (HH:mm)',
          formatter: (value:any, { series, seriesIndex, dataPointIndex, w }:any)=> {

            return formatDate(new Date(value),'HH:mm:ss')

          }
          // custom: ({series, seriesIndex, dataPointIndex, w}:any) => {
          //     var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

          //     return ''
          // }
        },
        y:{
          title:{
            formatter(seriesName, { series, seriesIndex, dataPointIndex, w }:any) {

              // let jenis_tmp:any = w.globals.initialSeries[seriesIndex].data[dataPointIndex]?.['jenis'];
              return seriesName
                    // + (typeof jenis_tmp != 'undefined' && jenis_tmp != null 
                    // ? ' (' + jenis_tmp + ')'
                    // : '')
                    + ' : '
            },
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0
      },
    }

    setChartJarakSensorJam = {

      statusFound: false,
      series: [
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
      options: {...this.chartJarakSensorJam_OptionsChart}
    }

    // Tinggi Isi Tangki (Jam) 
    setChartTinggiJam = {

      statusFound: false,
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

    // Tinggi Isi Tangki (Jam) (Angka Modus / yang sering muncul)
    setChartTinggi_Modus_Jam = {

      statusFound: false,
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
      options: {...this.chartTinggiJam_Modus_OptionsChart}
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
            jarak_sensor_jam: true,
            tinggi_isi: true,
            tinggi_isi_jam: true,
            tinggi_isi_modus_jam: true,
            suhu_tangki: true,
            suhu_tangki_modus_jam: true,
            suhu_tangki_jam: true,
            suhu_tinggi_tangki_jam:true,
            volume_tangki_jam: true,
        },
        chartJarakSensorJam:{...this.setChartJarakSensorJam},
        chartTinggi:{...this.setChartTinggi},
        chartTinggiJam:{...this.setChartTinggiJam},
        chartTinggiModusJam:{...this.setChartTinggi_Modus_Jam},
        chartSuhuJam:{...this.setChartSuhuJam},
        chartSuhuModusJam:{...this.setChartSuhuModusJam},
        chartSuhuTinggiJam:{...this.setChartSuhuTinggiJam},
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
    
    // CUSTOM STYLE <SELECT />
    customStyle_SuhuTinggiTangki = {
        control: base => ({
            ...base,
            height:35,
            minHeight:35,
            fontSize:15,
            paddingTop:0,
            paddingBottom:0
        })
    }

    constructor(props:any){
        super(props)


        // filter item
        // let cari = _.filter(users, function(e){
        //   return e.age < 40
        // })


        // frequent item 
          // let arr:any = []
          // const arr2 = [{tinggi:12.34},{tinggi:12.34}, {tinggi:9.560}, {tinggi:9.56}, {tinggi:12.40}]
          // // // const bc = _.maxBy(arr,'length')
          
          // arr = arr2.map((ele)=>{
          //   return ele.tinggi   // [12.34, 12.40, 9.56]
          // })

          // let arr_countBy = []
          // let max_countBy_brief_all = _.countBy(arr);
          // let max_countBy_brief = _(arr).countBy().entries().maxBy(_.last);

          // let managecountby = _.countBy(arr);
          // let manageentries = _.entries(managecountby);

          // console.error(manageentries)

          // console.error("MAX COUNT BY BRIEF")
          // console.error(max_countBy_brief_all)
          // console.error(max_countBy_brief)
          // if (max_countBy_brief.length >= 1){
          //     // bila ada occurance (kemunculan) yang sama, maka ambil angka paling maksimal
          //     let obj_values_brief_all = Object.entries(max_countBy_brief_all);

          //     // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) == [2]
          //     let filter_values_brief_all = obj_values_brief_all.filter(elefil=>elefil[1] == max_countBy_brief[1]);

          //     let arr_getMax_Values = filter_values_brief_all.map((ele_max,idx_max)=>{
          //         return parseFloat(ele_max[0])
          //     })
          //     // ambil angka yang paling maksimal
          //     let getMax_Value = Math.max.apply(null, arr_getMax_Values)

          //     console.error(obj_values_brief_all)
          //     console.error(filter_values_brief_all)
          //     console.error(arr_getMax_Values)
          //     console.error(getMax_Value)
          // }

        // ... <END>

        // const tes:any = [['11',2], ['10',1], ['3',5]]
        // console.error(tes)
        // console.error(_(tes).maxBy(_.last))

        // let tes3 = _.maxBy(_.last(tes))
        // console.error(tes3)
        // let getdata:any = _.maxBy(_.first(tes))
        // console.error(getdata) 

        // console.error(max_countBy)

        // console.error(max_2)

        // ... <end frequent item>

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
          res.toLowerCase().indexOf(tangki_api) !== -1
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

    componentWillUnmount(): void {
      // amcharts
      if (this.root){
        this.root.dispose();
      }
    }

    generateAMChart(){
        // amCharts
        const root = am5.Root.new("chartdiv");

        this.root = root;

        root.setThemes([
          am5themes_Animated.new(root)
        ]);
    
        let chart = root.container.children.push( 
          am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout
          }) 
        );

        // Define data
        let data = [{
          category: "Research",
          value1: 1000,
          value2: 588
        }, {
          category: "Marketing",
          value1: 1200,
          value2: 1800
        }, {
          category: "Sales",
          value1: 850,
          value2: 1230
        }];

         // Create Y-axis
        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
          })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: "category"
          })
        );
        xAxis.data.setAll(data);

         // Create series
        let series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value1",
            categoryXField: "category"
          })
        );
        series1.data.setAll(data);

        let series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value2",
            categoryXField: "category"
          })
        );
        series2.data.setAll(data);

         // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

          // Add cursor
          chart.set("cursor", am5xy.XYCursor.new(root, {}));

          this.root = root;
    }

    generateAMChart_Column3D(data:any){
      
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdiv", am4charts.XYChart3D);

      chart.paddingBottom = 25;
      chart.angle = 70

      // chart.cursor.behavior = "none";

      // Add data
      // data = [{
      //   "country":"USA",
      //   "visits":4025
      // }
      // ,{
      //   "country": "China",
      //   "visits": 1882
      // }, {
      //   "country": "Japan",
      //   "visits": 1809
      // }, {
      //   "country": "Germany",
      //   "visits": 1322
      // }
      // ]
      chart.data = [...data];

      // chart.data = [{
      //   "country": "USA",
      //   "visits": 4025
      // }, {
      //   "country": "China",
      //   "visits": 1882
      // }, {
      //   "country": "Japan",
      //   "visits": 1809
      // }, {
      //   "country": "Germany",
      //   "visits": 1322
      // }
      // // , {
      // //   "country": "UK",
      // //   "visits": 1122
      // // }, {
      // //   "country": "France",
      // //   "visits": 1114
      // // }, {
      // //   "country": "India",
      // //   "visits": 984
      // // }, {
      // //   "country": "Spain",
      // //   "visits": 711
      // // }, {
      // //   "country": "Netherlands",
      // //   "visits": 665
      // // }, {
      // //   "country": "Russia",
      // //   "visits": 580
      // // }, {
      // //   "country": "South Korea",
      // //   "visits": 443
      // // }, {
      // //   "country": "Canada",
      // //   "visits": 441
      // // }, {
      // //   "country": "Brazil",
      // //   "visits": 395
      // // }, {
      // //   "country": "Italy",
      // //   "visits": 386
      // // }, {
      // //   "country": "Australia",
      // //   "visits": 384
      // // }, {
      // //   "country": "Taiwan",
      // //   "visits": 338
      // // }, {
      // //   "country": "Poland",
      // //   "visits": 328
      // // }
      // ];

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "tank_x";
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.inside = false;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.fontFamily = "Arial";
      categoryAxis.renderer.labels.template.fill = am4core.color("#000000");

      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.inside = true;
      categoryAxis.renderer.grid.template.disabled = true;
      
      categoryAxis!.tooltip!.label!.rotation = 270;
      categoryAxis!.tooltip!.label!.horizontalCenter = "right";
      categoryAxis!.tooltip!.label!.verticalCenter = "middle";
      

      // let labelTemplate = categoryAxis.renderer.labels.template;
      // labelTemplate.rotation = 270;
      // labelTemplate.hideOversized  = false;
      // labelTemplate.horizontalCenter = "right";
      // labelTemplate.verticalCenter = "middle";
      // labelTemplate.dy = 10; // moves it a bit down;
      // labelTemplate.inside = false; 

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = false;
      // valueAxis.title.fontSize = 9;
      // valueAxis.title.text = "Meter";
      // valueAxis.title.fontWeight = "bold";

      // categoryAxis.renderer.labels.template.rotation = -90;
      // categoryAxis.renderer.grid.template.location = 0;
      // // categoryAxis.renderer.labels.template.hideOversized = false;
      // categoryAxis.renderer.minGridDistance = 20;
      // categoryAxis.renderer.labels.template.horizontalCenter = "left";
      // categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.dy = 10;
      // categoryAxis.renderer.inside = false;

      // categoryAxis.tooltip.label.rotation = 270;
      // categoryAxis.tooltip.label.horizontalCenter = "right";
      // categoryAxis.tooltip.label.verticalCenter = "middle";

      // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.title.text = "Meter";
      // valueAxis.title.fontWeight = "bold";
      // valueAxis.renderer.grid.template.disabled = false;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries3D());
      series.dataFields.valueY = "tank_value";
      series.dataFields.categoryX = "tank_x";
      series.name = "Tank";
      series.tooltipText = "{categoryX}: [bold]{valueY} m [/]";
      series.columns.template.fillOpacity = 1;    // opacity bar column

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 0;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target!.dataItem!.index);
      })

      columnTemplate.adapter.add("stroke", function(stroke, target:any) {
        return chart.colors.getIndex(target!.dataItem!.index);
      })

//       let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.renderer.grid.template.disabled = true;


      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 1;

      chart.cursor.xAxis = categoryAxis;
      // chart.cursor.fullWidthLineX = true;
      // chart.cursor.lineX.strokeWidth = 0;
      // chart.cursor.lineX.fill = am4core.color("#8F3985");
      // chart.cursor.lineX.fillOpacity = 0;

      // disable zoom in
      chart.cursor.behavior = "none";
      // chart.colors.list = [
      //   am4core.color("#fe7096"),
      //   am4core.color("#90caf9"),
      //   am4core.color("#84d9d2"),
      //   am4core.color("#b9dd77"),
        // am4core.color("#845EC2"),
        // am4core.color("#D65DB1"),
        // am4core.color("#FF6F91"),
        // am4core.color("#FF9671"),
        // am4core.color("#FFC75F"),
        // am4core.color("#F9F871")
      // ];
      
    
      this.chart_amColumn3d = chart;
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
      this.hide_amlogo();
    }

    async componentDidMount() {

      // SAMPLE EXPORT TO EXCEL
        // this.data_Export = [
        //   {
        //     name: "Johson",
        //     amount: 500,
        //     sex: 'M',
        //     is_married: true
        // },
        // {
        //     name: "Monika",
        //     amount: 355000,
        //     sex: 'F',
        //     is_married: false
        // },
        // {
        //     name: "John",
        //     amount: 250000,
        //     sex: 'M',
        //     is_married: false
        // },
        // {
        //     name: "Josef",
        //     amount: "450500",
        //     sex: 'M',
        //     is_married: true
        // }

        //   // {
        //   //   columns:[
        //   //     {
        //   //       value: "Headings",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "20", bold:true}}
        //   //     },
        //   //     {
        //   //       value: "Text Style",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "24", bold:true}}
        //   //     },
        //   //     {
        //   //       value: "Colors",
        //   //       widthPx: 100,
        //   //       style: { font: { sz: "40", bold:true}}
        //   //     }
        //   //   ],
        //   //   data: [
        //   //     [
        //   //       { value: "H1", style: {font: {sz: "40", bold:true}}},
        //   //       { value: 50, style: {font: {bold:true}}},
        //   //       { value: "Red", style: {fill: 
        //   //                                   {patternType:"solid", fgColor: { rgb: "FF0000"},
        //   //                                   bgColor: { rgb: "FF0000"}}
        //   //                               }}
        //   //     ],
        //   //     [
        //   //       { value: "H2", style: {font: {sz: "18", bold:true}}},
        //   //       { value: 10},
        //   //       { value: "Blue", style: {fill: 
        //   //                                   {patternType:"solid", fgColor: { rgb: "FF00FF"},
        //   //                                   bgColor: { rgb: "FF00FF"}}
        //   //                               }
        //   //       }
        //   //     ]
        //   //   ]
        //   // }
        // //   // {
        // //   //   // xSteps: 0,
        // //   //   // ySteps: 3,
        // //   //   columns:[
        // //   //     {
        // //   //       value: "Headings",
        // //   //       width: {wch:200},
        // //   //       style: { font: { sz: "20", bold:true}}
        // //   //     },
        // //   //     {
        // //   //       value: "Text Style",
        // //   //       widthPx: 180,
        // //   //       style: { font: { sz: "24", bold:true}}
        // //   //     },
        // //   //     {
        // //   //       value: "Colors",
        // //   //       widthPx: 180,
        // //   //       style: { font: { sz: "40", bold:true}}
        // //   //     }
        // //   //   ],
        // //   //   data: [
        // //   //     [
        // //   //       { value: "H1", style: {font: {sz: "40", bold:true}}},
        // //   //       { value: "Bold", style: {font: {bold:true}}},
        // //   //       { value: "Red", style: {fill: 
        // //   //                                   {patternType:"solid", fgColor: { rgb: "FFFF0000"},
        // //   //                                   bgColor: { rgb: "FFFF0000"}}
        // //   //                               }}
        // //   //     ],
        // //   //     [
        // //   //       { value: "H2", style: {font: {sz: "18", bold:true}}},
        // //   //       { value: "Underline", style: {font: {underline:true}}},
        // //   //       { value: "Blue", style: {fill: 
        // //   //                                   {patternType:"solid", fgColor: { rgb: "FFFFAA00"},
        // //   //                                   bgColor: { rgb: "FFFFAA00"}}
        // //   //                               }}
        // //   //     ]
        // //   //   ]
        // //   // }
        // ] 

        // this.setState({ 
        //   waktu:{
        //     tanggal:formatDate(new Date(),'DD MMMM YYYY'),
        //     tanggal_jam:formatDate(new Date(),'DD MMMM YYYY HH:mm:ss')
        //   }
        // })

        // this.generateAMChart_Column3D(
        //   [
        //     {
        //       "country": "USA",
        //       "visits": 4025
        //     }, {
        //       "country": "China",
        //       "visits": 1882
        //     }
        //   ]
        // )
        

        let length_mst_list_tangki:any = this.mst_list_tangki.length;

        // hit api yang getAllData
        // await postApi("https://platform.iotsolution.id:7004/api-v1/getLastData",null,true,'2',null,(res:any)=>{

        await postApi("http://192.168.1.120:7004/api-v1/getLastData",null,true,'2',null,(res:any)=>{
          
          if (res?.['responseCode'] == "200"){
              let res_data:any = res?.['data'];

              if (typeof res_data != 'undefined' && res_data != null){

                  // ambil data dengan id devices "BESTAGRO"
                  this.arr_json_alldata = [...
                      res_data.filter((res:any)=>{

                          // const device_patt = new RegExp(/BESTAGRO_[0-9]+_NEW/,'gi')
                          // penamaan device baru => BESTAGRO_001_NEW
                          
                          if (typeof res?.['id_device'] != 'undefined' &&
                              res?.['id_device'] != null && 
                              res?.['id_device'].toString().toUpperCase().indexOf("BESTAGRO") != -1)
                              // device_patt.test(res?.['id_device']))
                          {
                              return true
                          }
                      })
                  ]

                  // isi data paling uptodate per tangki
                  this.arr_json_alldata.forEach((ele:any) => {
                      let data_arr:any = (ele?.['data']?.[0]);

                      // last tangki 4
                      // console.log("ini element ")
                      // console.log(ele)

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
              

              // ===== MODUS DATA REAL TIME =====

              // AMBIL DATA YANG PALING SERING MUNCUL UNTUK MASING-MASING TANGKI
              // AMBIL KELIPATAN 10 MENIT TERAKHIR
              // MISAL : WAKTU 07:26, AMBIL 07:11 - 07:20
              // MISAL : WAKTU 07:00, AMBIL 06:41 - 06:50
              this.processPreviousMinTank_fromLast(this.arr_json_tangki_last)

              this.hide_amlogo();
              
              // return
              // ===== <END MODUS DATA> =====

              
              // ISI DATA arr_json_tangki_last (di proses pada kalkulasi tinggi)
              // 
              // this.kalkulasi_tinggi_tangki(()=>{
              //   this.kalkulasi_suhu_tangki(()=>{
              //     this.kalkulasi_set_others_tangki(()=>{
              //       this.kalkulasi_volume_tangki(()=>{

              //           let getFirstTangkiList = this.mst_list_tangki.length > 0 ? {...this.mst_list_tangki[0]} : {}
              //           this.getFirstTangki_Default = {...getFirstTangkiList}
                
              //           this.setState({
              //             ...this.state,
              //             chartSuhuTinggiJam: {
              //                   ...this.state.chartSuhuTinggiJam,
              //                   suhuTinggiSelected: {...getFirstTangkiList}
              //             }
              //           })

              //           this.getDateMax_From_TangkiLast();

              //           setTimeout(()=>{
              //             this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last);
              //           },100)

              //       })
              //     });
              //   });
              // });
          }
          else if (res?.['statusCode'] == '400'){
            notify('error',res?.['msg'])
          }
        })

        
        // dapatkan tanggal terakhir dari semua tangki yang ter-update
        // this.getDateMax_From_TangkiLast();
        // untuk chart per jam
        
        // sini
        

        // alert(JSON.stringify(this.state.chartSuhuTinggiJam.suhuTinggiSelected))
        // alert(JSON.stringify(this.getFirstTangki_Default))

        // setTimeout(()=>{
        //   this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last);
        // },100)

        

        // alert(formatDate(new Date(),'HH:mm'))
        return
    }

    hide_amlogo(){
      // HILANGKAN LOGO AM CHARTS KIRI BAWAH
      setTimeout(()=>{
          let am_logo = document.querySelectorAll('#chartdiv svg g[aria-labelledby]')
          let g_idx_length:number = am_logo.length-1;

          console.log("am_logo[g_idx_length-1]")
          console.log(am_logo[g_idx_length])
        
          if (am_logo?.[g_idx_length] != null){
            // document.getElementById('#chartdiv')!.style .display = "none"

            am_logo.forEach((ele,idx)=>{
                if (idx == g_idx_length){
                  // SET ID DAHULU, agar bisa dihapus
                    ele.setAttribute("id", "amchart-custom-" + idx.toString())
                }
            })

            // am_logo[g_idx_length].style.display = "none";
          }

          let am_logos = document.querySelectorAll('#chartdiv svg g[aria-labelledby]')
          am_logos.forEach((ele,idx)=>{
              if (idx == g_idx_length){
                  // console.error("ini")
                  // console.error(ele.id);
                  document.getElementById(ele.id)!.style.display = "none";
              }
          })

          // am_logo.forEach((ele)=>{
          //   console.log(ele)
          // })
      },10)
    }

    processPreviousMinTank_fromLast(arr_json_tangki_last:any){
        // array json tangki last (REAL TIME)
        console.error(arr_json_tangki_last)

        this.arr_tangki_last_from_dataHour = {};

        // variable menampung data semua array based on looping nama tangki (ada 4), ada kemungkinan double
        let arr_raw_all:any = [];

        // LOOPING NAMA TANGKI (KEY PERTAMA)
        let obj_keys_last:any = Object.keys(arr_json_tangki_last);

        

        // panjang tangki obj_keys_last
        let obj_keys_last_length:any = obj_keys_last.length;
        let obj_keys_last_onprogress:any = 0;

        obj_keys_last.forEach((ele_name, idx_rec)=>{

            let time_tank:any;

            try {
              time_tank = new Date(arr_json_tangki_last[ele_name]?.['time']);
            }catch(e){
              time_tank = null
            }
            
            // FOR TEST
            // 23 feb '23 jam 7:30
            // time_tank = new Date(2023,1,23, 7,30,0)

            if (time_tank != null){
                // jika tanggal, maka di proses
                // let ten_fold_prior:any = 1000 * 60 * 
                let time_tank_getMinutes:any = time_tank.getMinutes();    //menit : 41
                let mod_ten:any = time_tank_getMinutes % 10;        //mod : 1
                let time_tank_dispute:any = time_tank_getMinutes - mod_ten; // 41-1=40

                let time_tank_substract_minutes:any;
                let time_tank_time_begin:any, time_tank_time_last:any;  // tanggal yg di filter sudah fix begin dan last

                let time_tank_setmin_new:any;   // set minute
                let time_tank_setmin_dispute:any;

                if (time_tank_dispute == time_tank_getMinutes){
                  // jika menit nya sama, maka kurangi 19 menit (00:00, 10:00, 20:00)
                  // jika tidak, maka kurangi 9 menit
                    time_tank_substract_minutes = 19 * 60 * 1000    // 19 menit
                }
                else{
                    time_tank_substract_minutes = 9 * 60 * 1000     // 9 menit

                    // time_tank_time_begin = new Date(time_tank_time_begin.setSeconds(0));
                }

                  time_tank_setmin_new = time_tank   // ambil master 07:41
                  time_tank_setmin_new = new Date(time_tank_setmin_new).setMinutes(time_tank_dispute)    // set ke 07:40

                  // time START *
                  // misal tgl 25 feb 2023 00:05:00, 
                  //  maka time begin nya harusnya menjadi 24 feb 2023 23:51
                  time_tank_time_begin = new Date(time_tank_setmin_new - time_tank_substract_minutes);    // 07:40 kurang 9 menit atau 07:00 kurang 19 menit
                  time_tank_time_begin = new Date(time_tank_time_begin.setSeconds(0));

                  // time END * (ditambah 9 menit dari time start)
                  let time_minutes_add_9:any = 9 * 60 * 1000; 
                  let time_minutes_add_8:any = 8 * 60 * 1000;   // tambah 8 menit
                  // jika setelah ditambah 9 menit menjadi 00 (pindah tanggal berikutnya), maka di tambah 8 menit saja
                  // misal tgl 25 feb 2023 00:05:00, 
                  //  maka time last nya harusnya menjadi 24 feb 2023 23:59

                  let time_tank_begin_plus_9 = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_9));
                  if (time_tank_begin_plus_9.getMinutes() == 0){
                      time_tank_time_last = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_8));
                  }
                  else{
                      time_tank_time_last = new Date(parseFloat(time_tank_time_begin.getTime()) + parseFloat(time_minutes_add_9));
                  }
                  // set sampai detik 59
                  time_tank_time_last = new Date(time_tank_time_last.setSeconds(59));

                  // time_tank_time_last.setMinutes(59);
                  // alert(time_tank_time_last
                  
                  let datebegin:any = formatDate(time_tank_time_begin,'YYYY-MM-DD');

                  if (time_tank_time_begin.getMinutes() == 1){
                      time_tank_time_begin = new Date(time_tank_time_begin.setMinutes(0));
                  }

                  let hourbegin = formatDate(time_tank_time_begin,'HH:mm');
                  let hourlast = formatDate(time_tank_time_last,'HH:mm');

                  // simpan data tanggal realtime beserta jam
                  // [{datebegin:..., datelast:..., hourbegin:..., hourlast:...}]
                  this.arr_date_realtime = [
                    ...this.arr_date_realtime,
                    {
                      time_tank,
                      time_tank_getTime: !isNaN(time_tank) ? time_tank.getTime() : 0,
                      datebegin: time_tank_time_begin,
                      datelast: time_tank_time_last,
                      hourbegin,
                      hourlast
                    }
                  ]

                  // masukkan datebegin, datelast, hourbegin, hourlast ke arr_json_tangki_last
                  this.arr_json_tangki_last[ele_name] = {
                      ...this.arr_json_tangki_last[ele_name],
                      datebegin: time_tank_time_begin,
                      datelast: time_tank_time_last,
                      hourbegin,
                      hourlast
                  }

                  // alert(hourbegin + '\n' + hourlast)

                  console.error('Time Master : ' + time_tank + 
                        '\nTime Start : ' + time_tank_time_begin + 
                        '\nTime End : ' + time_tank_time_last)

                  this.getDataHour_Await(datebegin, hourbegin, hourlast, (res_data)=>{
                      // console.error("SELESAI AWAIT POST API " + ele_name)
                      // console.error("getDataHour_Await Data:")
                      // console.error(res_data)

                      // console.log(res_data?.['data'])

                      
                      if (res_data?.['responseCode'] == "200"){
                        console.log("res data NEW")
                        console.log(res_data)
                        arr_raw_all = [
                            ...arr_raw_all,
                            ...res_data?.['data']
                        ]
                      }
                      obj_keys_last_onprogress++;
                      // console.error(obj_keys_last_onprogress)
                      
                    });

                // alert(time_tank_getMinutes + ' -> ' + mod_ten + ' -> ' +
                //       time_tank_dispute + ' -> \n Time Begin : ' + time_tank_time_begin + 
                //       '\nTime Master : ' + new Date(time_tank))
            }
        })

        let intOnProgress = setInterval(()=>{
            
            if (obj_keys_last_onprogress == obj_keys_last_length){
              // console.error(' ==== ARR RAW ALL ====')
              // console.error(arr_raw_all)

              let arr_raw_reduce:any = this.grouping_Data_Raw(arr_raw_all);

              this.funcSeparateTank(arr_raw_reduce, ()=>{

                    let getFirstTangkiList = this.mst_list_tangki.length > 0 ? {...this.mst_list_tangki[0]} : {}
                    this.getFirstTangki_Default = {...getFirstTangkiList}
        
                    this.setState({
                      ...this.state,
                      chartSuhuTinggiJam: {
                            ...this.state.chartSuhuTinggiJam,
                            suhuTinggiSelected: {...getFirstTangkiList}
                      }
                    })

                    this.getDateMax_From_TangkiLast();

                    setTimeout(()=>{
                      console.error("GET DATE MAX FROM TANGKI LAST NEW ===")
                      console.error(this.arr_json_tangki_last)

                      let arr_maxDate_ForPerHour:any;
                      let maxDate_ForPerHour:any;
                      let get_maxDate_ForPerHour:any;
                      let get_hourbegin_ForPerHour:any;
                      let get_hourlast_ForPerHour:any;

                      if (typeof this.arr_date_realtime != 'undefined' && this.arr_date_realtime != null){
                        arr_maxDate_ForPerHour = this.arr_date_realtime.map(ele=>ele?.['time_tank_getTime']);
                        maxDate_ForPerHour = Math.max.apply(null, arr_maxDate_ForPerHour);
                        get_maxDate_ForPerHour = this.arr_date_realtime.filter(ele=>ele?.['time_tank_getTime'] == maxDate_ForPerHour)[0];
                        get_hourbegin_ForPerHour = get_maxDate_ForPerHour?.['hourbegin'];
                        get_hourlast_ForPerHour = get_maxDate_ForPerHour?.['hourlast'];
                      }
                      
                      // console.error(get_maxDate_ForPerHour)
                      // console.error(maxDate_ForPerHour)

                      console.error("... end arr_json_tangki_last")

                      this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last,
                                      get_hourbegin_ForPerHour, get_hourlast_ForPerHour);
                    },100)
              });


              clearInterval(intOnProgress)
            }
        })
    }

    grouping_Data_Raw(arr_raw_all:any){
        // HILANGKAN DATA DOUBLE
        let arr_raw_all_reduce:any = [];

        if (Array.isArray(arr_raw_all)){
          if (arr_raw_all.length > 0){

              arr_raw_all_reduce = arr_raw_all.reduce((arr_tmp, new_obj)=>{

                  let findItem = arr_tmp.find((ele)=>{
                      if (ele?.['time'] == new_obj?.['time'] &&
                          ele?.['id_device'] == new_obj?.['id_device'])
                      {
                          return true
                      }
                  })
                  if (!findItem){
                      return [...arr_tmp, {...new_obj}]
                  }else{
                    return [...arr_tmp]
                  }

              }, [])

          }
        }
        // console.error("ARR RAW ALL REDUCE (FINAL)")
        // console.error(arr_raw_all_reduce)

        return arr_raw_all_reduce
    }

    funcSeparateTank(arr_raw_alls:any, callback){
        let obj_tank:any = {};

        // function untuk memisahkan tangki ke masing-masing key
        // obj = {tangki_1: {'volume isi tank 1':'...', 'Jarak Sensor dengan permukaan Tank 1' : '774.91', 'id_device':"BESTAGRO_002_NEW"}}
        //       ,{tangki_2: {'volume isi tank 2':'...', 'Jarak Sensor dengan permukaan Tank 2' : '203.77', 'id_device':"BESTAGRO_002_NEW"}}
        //       ,{tangki_3: {'volume isi tank 3':'...', 'Jarak Sensor dengan permukaan Tank 3' : '1033.42', 'id_device':"BESTAGRO_001"}}
        //       ,{tangki_4: {'volume isi tank 4':'...', 'Jarak Sensor dengan permukaan Tank 4' : '617.36', 'id_device':"BESTAGRO_001"}}
        
        console.error("ARR RAW ALL REDUCE (FINAL)")
        
        for (let [i, v] of arr_raw_alls.entries()){
              // index (i), values (v)

            // console.error(i, v)
            let data_arr:any = v?.['data']?.[0];

            let time:any = v?.['time'] ?? '';
            let time_getTime:any = v?.['time'] != null ? new Date(v?.['time']).getTime() : 0;
            let id_device:any = v?.['id_device'] ?? '';
            let rawData:any = v?.['rawData'];
            // console.error(data_arr)

            // ambil dan simpan masing-masing tangki
            // looping dalam object data_arr

            let obj_store_temp:any = {};
            let obj_store_suhu_temp:any = {};


            Object.keys(data_arr).forEach((ele_attr:any)=>{

                let patt_tank = new RegExp(/(Tank [0-9]+)/,'gi');
                let patt_tank_exec = patt_tank.exec(ele_attr);
                if (patt_tank_exec != null){

                  let data_tank:any = patt_tank_exec[0];

                  let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                  if (find_mst_list){
                      // nama tangki harus ada dalam list master, baru dapat disimpan
                        let nama_tangki:any = find_mst_list?.['name'] ?? '';
                        let title_tangki:any = find_mst_list?.['title'] ?? '';


                      // ** HITUNG TINGGI CPO / PKO **

                        let patt_tinggi = new RegExp(/(Jarak Sensor dengan permukaan Tank [0-9]+)/,'gi')
                        let patt_tinggi_exec = patt_tinggi.exec(ele_attr);
                        
                        let tangki_jarak_sensor:any;
                        let tinggi_hitung:any   // tinggi cpo / pko

                        // console.error("patt_tinggi_exec")
                        // console.error(patt_tinggi_exec)

                        if (patt_tinggi_exec != null){

                            let data_jarak_sensor:any = patt_tinggi_exec['input'];

                             tangki_jarak_sensor =  data_arr?.[data_jarak_sensor];

                             if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                                if (typeof tangki_jarak_sensor == 'string'){
                                  tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                                  // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                                }else{
                                  // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                                  tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                                }
                            }else{tangki_jarak_sensor = 0}


                            let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]);
                            tinggi_hitung = Math.round((this.mst_t_tangki?.[nama_tangki] - ruang_kosong) * 1000) / 1000;

                            if (tinggi_hitung < 0){
                              tinggi_hitung = 0;
                            }

                        }

                      // ... ** end TINGGI CPO / PKO

                      // ** SET SUHU TINGGI **
                        let patt_tank_tinggi_num_exec_final:any;
                        let data_temperature:any;

                        let patt_suhu = new RegExp(/(Temperature Tank [0-9]+)/,'gi')
                        let patt_suhu_exec = patt_suhu.exec(ele_attr);
                        if (patt_suhu_exec != null){
                            data_temperature = patt_suhu_exec['input'];

                            let patt_tank_number = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                            let patt_tank_number_exec = patt_tank_number.exec(ele_attr) ?? -1

                            patt_tank_tinggi_num_exec_final = patt_tank_number_exec != null 
                                          ? parseFloat(patt_tank_number_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null
                            
                            // SET SUHU SEMENTARA DI obj_store_suhu_temp per SATU DATA ARR object
                            if (typeof obj_store_suhu_temp?.[nama_tangki] == 'undefined' ||
                                obj_store_suhu_temp?.[nama_tangki] == null)
                            {
                                obj_store_suhu_temp[nama_tangki] = 
                                {
                                    data_suhu: [data_arr?.[data_temperature]],
                                    data_suhu_tank_num: [patt_tank_tinggi_num_exec_final]
                                }
                            }
                            else{
                                obj_store_suhu_temp[nama_tangki] = 
                                {
                                  ...obj_store_suhu_temp[nama_tangki],
                                  data_suhu: [...obj_store_suhu_temp[nama_tangki]['data_suhu'], 
                                                data_arr?.[data_temperature]
                                            ],
                                  data_suhu_tank_num: [...obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'], 
                                                          patt_tank_tinggi_num_exec_final
                                                      ],
                                }
                            }
                        }
                      // ... ** end SET SUHU TINGGI **



                      if (typeof obj_store_temp?.[nama_tangki] == 'undefined' ||
                            obj_store_temp?.[nama_tangki] == null)
                      {
                          // jika tidak ada key tangki nya
                          obj_store_temp[nama_tangki] = 
                            {
                              [ele_attr]: data_arr[ele_attr],
                              data_suhu: obj_store_suhu_temp[nama_tangki]['data_suhu'],
                              data_suhu_tank_num: obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'],
                              time,
                              time_getTime,
                              id_device,
                              rawData
                            }

                          // ** HITUNG TINGGI CPO / PKO
                          if (typeof tangki_jarak_sensor != 'undefined'){
                              obj_store_temp[nama_tangki]['tinggi_minyak'] = tinggi_hitung;
                          }
                          // ... end ** HITUNG TINGGI CPO / PKO
                          
                      }
                      else{
                          // jika ada key tangki nya
                          obj_store_temp[nama_tangki] = 
                              {
                                ...obj_store_temp[nama_tangki],
                                [ele_attr]: data_arr[ele_attr],
                                data_suhu: obj_store_suhu_temp[nama_tangki]['data_suhu'],
                                data_suhu_tank_num: obj_store_suhu_temp[nama_tangki]['data_suhu_tank_num'],
                                time,
                                time_getTime,
                                id_device,
                                rawData
                              }

                          // ** HITUNG TINGGI CPO / PKO
                          if (typeof tangki_jarak_sensor != 'undefined'){
                              obj_store_temp[nama_tangki]['tinggi_minyak'] = tinggi_hitung;
                          }
                          // ... end ** HITUNG TINGGI CPO / PKO

                      }
                      
                  }
                }
            })
            // ... end looping dalam object data_arr key


            // simpan hasil kumpulan key ke obj_tank (final)
            Object.keys(obj_store_temp).forEach((ele_nama_tangki,idx_store)=>{

                let arr_tinggi_suhu_tmp:any = [];
                let arr_tinggi_suhu_val_tmp:any = [];

                let volume_tbl:any = 0;
                let volume_prev:any;
                let volume_tbl_plus_beda_liter:any;
                let faktor_koreksi_temp:any;
                let find_berat_jenis:any

                let arr_obj_tmp_tank_data:any = obj_store_suhu_temp[ele_nama_tangki]['data_suhu'];

                // REVISI KETINGGIAN SUHU yang KE CELUP  20 feb '23
                let obj_tmp_tank_tinggi_minyak:any = parseFloat(obj_store_temp[ele_nama_tangki]['tinggi_minyak']);
                if (obj_tmp_tank_tinggi_minyak >= 1){

                  if (arr_obj_tmp_tank_data.length > 0){
                      arr_obj_tmp_tank_data.forEach((ele_suhu_num,idx)=>{
                          // [1, 3, 5, 7, 10]
                          let data_suhu_tank_num_idx:any = obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx];
                          if (obj_tmp_tank_tinggi_minyak < 4)
                          {
                              // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                              if (data_suhu_tank_num_idx == 1){
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                              // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                              if (data_suhu_tank_num_idx <= 3){    // ambil [1,3]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                              // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                              if (data_suhu_tank_num_idx <= 5){    // ambil [1,3,5]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                              // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                              if (data_suhu_tank_num_idx <= 7){    // ambil [1,3,5,7]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }
                          else
                          if (obj_tmp_tank_tinggi_minyak >= 10){
                              // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                              if (data_suhu_tank_num_idx <= 10){    // ambil [1,3,5,7,10]
                                  arr_tinggi_suhu_tmp.push(obj_store_temp[ele_nama_tangki]['data_suhu_tank_num'][idx]);
                                  arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                              }
                          }

                      })
                  }
                }
                else{
                  // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                  if (obj_tmp_tank_tinggi_minyak < 1){

                    let arr_obj_tmp_tank_data:any = obj_store_suhu_temp[ele_nama_tangki]['data_suhu_tank_num'];
                    let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                    if (findIdx != -1){
                        arr_tinggi_suhu_tmp.push(1);
                        arr_tinggi_suhu_val_tmp.push(obj_store_suhu_temp[ele_nama_tangki]['data_suhu'][findIdx]);
                    }
                  }
                    // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                }
                // ... <end REVISI KETINGGIAN>

                // let total:any = obj_temp_tank[ele_tank_name]['data'].reduce((tmp:any, val:any)=>{
                let total:any = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                  return tmp + parseFloat(val);
                },0)

                // average / rata-rata per tangki
                let avg_tank:any = (total / arr_tinggi_suhu_val_tmp.length).toFixed(3);
                // ... end average / rata-rata per tangki

                // VOLUME TANGKI
                let tinggi_tmp:any = parseFloat(obj_store_temp[ele_nama_tangki]['tinggi_minyak']).toFixed(3);
                let avg_tmp:any = parseFloat(avg_tank);

                let jenis:any = ''; // cpo atau pko

                if (tinggi_tmp != null){

                    // REVISI VOLUME BEDA LITER
                    let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi_tmp) * 100); // angka floor ( 1010 )
                    let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi_tmp) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
                    let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
                    // ... end <REVISI VOLUME BEDA LITER>
                    
                    // panggil array json tabel volume tangki yang sesuai
                    let arr_volume:any = this.json_arr_volume_tangki(ele_nama_tangki);

                    let findItem:any = arr_volume.find(res=>
                          // parseInt(res.tinggi) == Math.round(tinggi_tmp.toFixed(2) * 100)
                          // in chrome toFixed not rounding (.5) => misal: 5.335 -> 5.33; 5.336 -> 5.34
                          // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi_tmp).toFixed(2))*100)
                          // parseInt(res.tinggi) == Math.round(parseFloat(tinggi_tmp)*100)
                          parseInt(res.tinggi) == tinggi_tmp_floor
                    )

                    let tanggal_tangki:any = new Date(obj_store_temp[ele_nama_tangki]['time']);
                    
                    let findCpoPko = this.arr_cpo_pko.find(res=>
                            res.name == ele_nama_tangki &&
                            (
                              (new Date(res.datebegin) <= tanggal_tangki
                                  && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                              )
                              ||
                              (
                                (new Date(res.datebegin) <= tanggal_tangki)
                                  && (res.datelast == '' || res.datelast == null)
                              )
                            ) 
                            // && 
                            // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                    )
                    if (findCpoPko){
                        jenis = findCpoPko?.['jenis'];
                    }

                    if (findItem){
                  
                      let beda_liter_mst:any = 0;
                      let beda_liter_hitung:any = 0;

                      // VOLUME LITER ATAU KG tangki
                      volume_tbl = parseFloat(findItem.volume);
                      beda_liter_mst = parseFloat(findItem.beda_liter);


                      beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 
                      

                      volume_prev = volume_tbl;

                      if (typeof findItem?.['volume'] != 'undefined' &&
                            findItem?.['volume'] != null)
                      {
                          volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                      }

                      volume_tbl = volume_tbl_plus_beda_liter;


                      if (jenis != '' && jenis != null){
                          let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis);

                          find_berat_jenis = arr_berat_jenis.find(res=>
                              Math.round(parseFloat(res.temperature)) == Math.round(avg_tmp)
                          );
                          if (find_berat_jenis){
                              volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];
                              // volume_prev = volume_tbl;   // just info volume sebelumnya
                          }

                          faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(avg_tmp)));
                          if (faktor_koreksi_temp != null){
                              // console.error('volume tbl ',volume_tbl)
                              // console.log(tangki_name)
                              // console.error('faktor koreksi : ',faktor_koreksi_temp)
                              // console.error('volume tbl :  ',volume_tbl)
                              volume_tbl *= faktor_koreksi_temp;
                              // console.error('volume tbl (final) :  ',volume_tbl)

                              // console.error(find_berat_jenis?.['berat_jenis'])
                          }


                      }


                    }

                }
                // ... END VOLUME TANGKI

                if (typeof obj_tank?.[ele_nama_tangki] == 'undefined' ||
                    obj_tank?.[ele_nama_tangki] == null)
                {
                    obj_tank[ele_nama_tangki] = [
                        {...obj_store_temp[ele_nama_tangki],
                          avg: avg_tank,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp],
                          volume_prev,    // volume master
                          volume_tbl_plus_beda_liter,
                          volume: volume_tbl,
                          volume_faktor_koreksi: faktor_koreksi_temp,
                          volume_berat_jenis: find_berat_jenis?.['berat_jenis'],
                          jenis
                        }
                    ]
                }
                else{
                    obj_tank[ele_nama_tangki] = [
                        ...obj_tank[ele_nama_tangki],
                        {...obj_store_temp[ele_nama_tangki],
                          avg: avg_tank,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp],
                          volume_prev,    // volume master
                          volume_tbl_plus_beda_liter,
                          volume: volume_tbl,
                          volume_faktor_koreksi: faktor_koreksi_temp,
                          volume_berat_jenis: find_berat_jenis?.['berat_jenis'],
                          jenis
                        }
                    ]
                }
            })
            // ... end obj_store_temp

            

            // ... end looping dalam object data_arr

            // console.error("obj_tank")
            // console.error(obj_tank)

        }
        // ... end arr_raw_alls

        console.error("obj_tank")
        console.error(obj_tank)

        // AMBIL MODUS (TINGGI TERBANYAK) masing-masing tangki
        let obj_tank_modus:any = {};
        let obj_temp_tinggi_map:any = [];
        let obj_tinggi_map:any = {};
        let obj_tinggi_modus:any = {};
        let obj_tinggi_modus_filter:any = {};
        let obj_tinggi_tank_modus_filter_single:any = {};

        Object.keys(obj_tank).forEach((ele_nama_tangki, idx_obj_tank)=>{

            // [11.16, 11.10, 11.16, 11.16]
            obj_temp_tinggi_map = obj_tank?.[ele_nama_tangki].map((ele_key, idx_key)=>{
              return ele_key?.['tinggi_minyak']
            })
            // ... end []

            if (typeof obj_tinggi_map?.[ele_nama_tangki] == 'undefined'){
                // console.error(ele_nama_tangki)
                // console.error(obj_temp_tinggi_map)
                // console.error(obj_tinggi_map?.[ele_nama_tangki])

                // {'tangki_1' : [11.16, 11.10, 11.16, 11.16]}
                obj_tinggi_map = {
                  ...obj_tinggi_map,
                  [ele_nama_tangki]: [...obj_temp_tinggi_map]
                }
                // ... end {}

                if (typeof obj_tinggi_modus?.[ele_nama_tangki] == 'undefined')
                {

                    // single data yang sering keluar
                    let getFrequentItem:any = _(obj_temp_tinggi_map)
                          .countBy()
                          .entries()
                          .maxBy(_.last)

                    // hanya sebagai referensi master countBy
                    let obj_temp_tinggi_map_countBy = _.countBy(obj_temp_tinggi_map);

                    if (getFrequentItem.length >= 1){

                        let arr_val_y_countBy_entries = Object.entries(obj_temp_tinggi_map_countBy);

                        // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) => [2] == [2]
                        let filter_val_y_countBy_entries = arr_val_y_countBy_entries.filter(elefil => elefil[1] == getFrequentItem[1]);

                        let arr_getMax_Values = filter_val_y_countBy_entries.map((ele_max,idx_max)=>{
                            return parseFloat(ele_max[0])
                        })

                        // ambil angka tinggi yang paling maksimal (misal : 12.34)
                        let getMax_Value:any = Math.max.apply(null, arr_getMax_Values)

                        // console.error("obj_temp_tinggi_map_countBy")
                        // console.error(obj_temp_tinggi_map_countBy)
                        // console.error("getFrequentItem")
                        // console.error(getFrequentItem)
                        getFrequentItem = [[getMax_Value, getFrequentItem[1]]]
                        // console.error("getFrequentItem")
                        // console.error(getFrequentItem)
                    }
                    
                    // {tangki_1: ['3.853',8],
                    // tangki_2: ['11.146',8],
                    // tangki_3: ['0',9],
                    // tangki_3: ['1.621',7]}

                    obj_tinggi_modus = {
                      ...obj_tinggi_modus,
                      [ele_nama_tangki]: getFrequentItem
                    }
                    // console.error("obj_tinggi_modus")
                    // console.error(obj_tinggi_modus)

                    // filter yang ter banyak dari obj_tinggi_modus
                    if (typeof obj_tinggi_modus_filter?.[ele_nama_tangki] == 'undefined')
                    {
                        // console.error("PARSE FLOAT getFrequentItem")
                        // console.error(parseFloat(getFrequentItem[0])) // [1.621, 7] => 1.621

                        let arr_filter_temp = obj_tank?.[ele_nama_tangki].filter((ele,idx)=>{
                          return parseFloat(ele?.['tinggi_minyak']) == parseFloat(getFrequentItem[0])
                        })

                        // multi data yang terbanyak (beda jam dengan satu ketinggian)
                        obj_tinggi_modus_filter = {
                          ...obj_tinggi_modus_filter,
                          [ele_nama_tangki]: [...arr_filter_temp]
                        }

                        // single data (cari time yang paling max)
                        let arr_map_time_data:any = arr_filter_temp.map((ele,idx)=>{
                            return ele?.['time_getTime']
                        })

                        let arr_map_time_data_max:any = Math.max.apply(null, arr_map_time_data);
                        // ... end tanggal max

                        // console.log("arr_map_time_data MAX")
                        // console.log(arr_map_time_data_max)

                        // cari yang last update (tanggal ter-update)
                        let filter_single_modus:any = obj_tinggi_modus_filter[ele_nama_tangki].filter((ele,idx)=>{
                            return ele?.['time_getTime'] == arr_map_time_data_max
                        })
                        if (filter_single_modus.length > 0)
                        {

                            if (typeof obj_tinggi_tank_modus_filter_single?.[ele_nama_tangki] == 'undefined')
                            {

                              // hanya menampung satu data tanggal terakhir per tangki
                                obj_tinggi_tank_modus_filter_single = {
                                    ...obj_tinggi_tank_modus_filter_single,
                                    [ele_nama_tangki]: filter_single_modus?.[0]
                                }
                            }
                        }
                        
                        // ... end cari last update

                        console.log("arr_map_time_data")
                        console.log(arr_map_time_data)
                        console.log("obj_tinggi_tank_modus_filter_single")
                        console.log(obj_tinggi_tank_modus_filter_single)

                    }
                }

            }
        })
        // ... end obj_tank (per tangki_name)

        // UPDATE KE REALTIME
        let temp_updatedState_global:any = {};

        // inject dulu data dari this.state 
        temp_updatedState_global['realtime'] = {
            ...this.state['realtime']
        }

        let arr_tangki_name:any = [];
        let arr_tangki_tinggi:any = [];

        let arr_tangki_temp:any = [];

        // LOOPING obj_tinggi_tank_modus_filter_single
        Object.keys(obj_tinggi_tank_modus_filter_single).forEach((ele_tank_name,idx_tank_name)=>{

            // taruh di temp dahulu, baru di store ke setState (karena setState tidak bisa update di looping multi data)
            temp_updatedState_global['realtime'] = {

                ...temp_updatedState_global['realtime'],
                [ele_tank_name]: {
                    ...this.state.realtime[ele_tank_name],
                    tinggi: parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak']),
                    suhu: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg'],
                    suhu_tank_num: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu'],
                    suhu_tank_num_raw: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['data_suhu_tank_num'],
                    avg_tinggi_suhu: [...obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg_tinggi_suhu']],
                    avg_tinggi_suhu_val: [...obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['avg_tinggi_suhu_val']],
                    volume: Math.round(parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume']) * 100) / 100,
                    volume_prev: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_prev'],
                    volume_tbl_plus_beda_liter: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_tbl_plus_beda_liter'],
                    volume_berat_jenis: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_berat_jenis'],
                    volume_faktor_koreksi: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['volume_faktor_koreksi'],
                    tanggal: formatDate(new Date(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['time']), 'DD MMMM YYYY'),
                    tanggal_jam: formatDate(new Date(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['time']), 'DD MMMM YYYY HH:mm:ss'),
                    jenis: obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['jenis']
                }
            }

            // TITLE TINGGI ISI TANGKI (m)
            let find_tangki_title:any = this.mst_list_tangki.find(res_tank=>res_tank.name == ele_tank_name);
            if (find_tangki_title){
              arr_tangki_name.push(
                  // [find_tangki_title['title'], tanggal, jam]
                  find_tangki_title['title']
              );
            }
            arr_tangki_tinggi.push(parseFloat(obj_tinggi_tank_modus_filter_single?.[ele_tank_name]?.['tinggi_minyak']));
        })
        // ... end LOOPING obj_tinggi_tank_modus_filter_single

        arr_tangki_name.forEach((ele, idx)=>{

            let patt = new RegExp(/([0-9]+)/,'gi');
            let match:any = patt.exec(ele);
            let angka_temp:any = 0;
            if (match){
              angka_temp = match[0];
            }

            arr_tangki_temp.push(
              {x: ele, y: arr_tangki_tinggi[idx], 
                tangki_num: parseFloat(angka_temp)}
            )
        })

        // sort
        if (arr_tangki_temp){
          arr_tangki_temp.sort((a,b)=>{
            return a['tangki_num'] - b['tangki_num']
          })
        }
        // ... end sort

        
        this.setState({
          ...this.state,
          loader:{
              ...this.state.loader,
              tinggi_isi:false,
              suhu_tangki: false,
              suhu_tangki_modus_jam: false
          },
          chartTinggi:{
              ...this.state.chartTinggi,
              options:{
                  ...this.state.chartTinggi.options,
                  xaxis:{
                    ...this.state.chartTinggi.options.xaxis,
                    // categories: [...arr_tangki_name]    // ["Tangki 1","Tangki 2","Tangki 3","Tangki 4"]
                  }
              },
              series: [
                {
                  // data:[...arr_tangki_tinggi],  // [4.55, 8.81, ...]
                  data:[...arr_tangki_temp], 
                  name: "Tinggi Isi Tangki"}
              ]
          },
          ...temp_updatedState_global
        })

        let obj_tinggi_isi_amchart:any = [];

        Object.keys(temp_updatedState_global?.['realtime']).forEach((ele_tank_name,idx_tank)=>{
            let find_mst_tangki = this.mst_list_tangki.find(ele_tank=>ele_tank?.['name'] == ele_tank_name)
            let title_tangki = find_mst_tangki ? find_mst_tangki?.['title'] : '';

            obj_tinggi_isi_amchart = [
              ...obj_tinggi_isi_amchart,
              {
                tank_x: title_tangki,
                tank_value: isNaN(temp_updatedState_global?.['realtime']?.[ele_tank_name]?.['tinggi']) ? 
                          0
                        :
                        temp_updatedState_global?.['realtime']?.[ele_tank_name]?.['tinggi']
              }
            ]
        })

        
        setTimeout(()=>{
          console.log("obj_tinggi_isi_amchart")
          console.log(obj_tinggi_isi_amchart)
          this.generateAMChart_Column3D(obj_tinggi_isi_amchart)
          callback()
        })

        // ... end UPDATE KE REALTIME

          // console.error("obj_tinggi_map")
          // console.error(obj_tinggi_map)
          // console.error(obj_tinggi_modus)
          // console.error("obj_tinggi_modus_filter")
          // console.error(obj_tinggi_modus_filter)



        // ... END END MODUS

    }

    getDataHour_Await(datebegin, hourbegin, hourlast, callback){

        let data_temp:any = [];

        // postApiSync("https://platform.iotsolution.id:7004/api-v1/getDataHour?sort=ASC",null,'1',

        postApiSync("http://192.168.1.120:7004/api-v1/getDataHour?sort=ASC",null,'2',
          {
            "date":formatDate(new Date(datebegin),'YYYY-MM-DD'),
            // // === BALIKKIN LAGI ===
            // "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '00:00' : hourbegin,
            "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '06:00' : hourbegin,
            // "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '23:59' : hourlast,
            "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '06:30' : hourlast,
            "minutes":true
          }
        )
        .then(result=>{
            // console.log("MULAI")
            data_temp = JSON.parse(JSON.stringify(result))
            // console.log(data_temp)
            callback(data_temp)
        })
      
      // (res:any)=>{

      //     if (res?.['responseCode'] == "404"
      //       || 
      //       (res?.['responseCode'] == "200" && res?.['data'].length == 0))
      //     {
      //       // jika data kosong, maka nanti munculkan icon no data found
      //       // notify("error", res?.['responseDesc']);
      //     }

      //     if (res?.['responseCode'] == "200"){
      //       let res_data:any = res?.['data'];
      //       // console.error("await post api ")
      //       callback(res_data)
      //     }
      // })
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

    updateSuhuTinggiTangki_PerJam(nama_tangki:any, patt_exec:any, time_tank:any, data_arr:any, data_temperature:any, obj_temp_tank?:any){

      let patt_tinggi_tangki:any = new RegExp(/tinggi [0-9]+.?M/,'gi')
      // patt_exec['input'] = "Temperature Tank 1 BA tinggi 7 M"
      let result_tinggi_tangki:any = patt_tinggi_tangki.exec(patt_exec['input']);
      if (typeof result_tinggi_tangki?.[0] != 'undefined' &&
            result_tinggi_tangki?.[0] != '')
      {
          let patt_final_tinggi:any = new RegExp(/[0-9]+.?M/,'gi')
          let result_final_tinggi:any = patt_final_tinggi.exec(result_tinggi_tangki?.[0]);
          let tanggal_format:any;
          tanggal_format = formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss');

          if (typeof result_final_tinggi?.[0] != 'undefined' && result_final_tinggi?.[0] != null){

            // isi suhu tinggi tangki ke dalam obj_suhu_tinggi_tangki_perjam_series

            // result_final_tinggi[0] => 1 M, 3 M, 5 M, 7 M, 10 M

            let obj_keys_suhutinggi:any = Object.keys(this.obj_suhu_tinggi_tangki_perjam_series);
            let obj_keys_suhutinggi_cek:any = this.obj_suhu_tinggi_tangki_perjam_series?.[nama_tangki];

            if (typeof obj_keys_suhutinggi_cek == 'undefined' ||
                  obj_keys_suhutinggi_cek == null)
            {
                // JIKA DATA TIDAK ADA 
                // console.error("DATA TEMPERATURE TANK")
                // console.log(data_temperature)   // Temperature Tank 2 BA tinggi 3 M
                // console.log(result_tinggi_tangki)   // json {0, input}

                // console.log(data_arr?.[data_temperature])   // 43.31
                // console.log(tanggal_format)   // 2023-02-08 09:00:57
                // console.log(result_final_tinggi[0])   // 5 M

                this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki] = [
                  {
                    name: result_final_tinggi[0],
                    data: [
                      {
                        x: tanggal_format,
                        y: data_arr?.[data_temperature],
                        x_time: new Date(tanggal_format).getTime(),
                        jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                      }
                    ]
                  }
                ]
            }
            else
            {
                // JIKA DATA TANGKI SUDAH ADA SEBELUMNYA, MAKA TINGGAL DI PUSH
                // cari yang misal '1 M' == '1 M'
                let findIdx:any = this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki].findIndex(res=>res.name == result_final_tinggi[0]);
                if (findIdx == -1){
                    // jika tidak ada, maka di push semua name dan data
                    this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki].push(
                      {
                          name: result_final_tinggi[0], // 1 M
                          data: [
                            {
                              x: tanggal_format,
                              y: data_arr?.[data_temperature],
                              x_time: new Date(tanggal_format).getTime(),
                              jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                            }
                          ]
                      }
                    )
                }
                else{
                  // jika exists, maka di push data saja
                  this.obj_suhu_tinggi_tangki_perjam_series[nama_tangki][findIdx]['data'].push(
                      {
                        x: tanggal_format,
                        y: data_arr?.[data_temperature],
                        x_time: new Date(tanggal_format).getTime(),
                        jenis: obj_temp_tank?.[nama_tangki]?.['jenis']
                      }
                  )
                }

                // console.log(this.obj_suhu_tinggi_tangki_perjam_series)

              }

          }
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
      // await postApi("https://platform.iotsolution.id:7004/api-v1/getDataHour?sort=ASC",null,true,'1',
        {
          "date":formatDate(new Date(datebegin),'YYYY-MM-DD'),
          // // === BALIKKIN LAGI ===
          // "hourBegin": typeof hourbegin == 'undefined' || hourbegin == null ? '00:00' : hourbegin,
          "hourBegin": (typeof hourbegin == 'undefined' || hourbegin == null) ? '06:00' : hourbegin,
          // "hourLast": typeof hourlast == 'undefined' || hourlast == null ? '23:59' : hourlast,
          "hourLast": (typeof hourlast == 'undefined' || hourlast == null) ? '07:10' : hourlast,
          "minutes":true
        },
      (res:any)=>{
        
        console.log("post api await per jam")
        console.log(res)

        if (res?.['responseCode'] == "404"
            || 
            (res?.['responseCode'] == "200" && res?.['data'].length == 0)){
            
            if (res?.['responseCode'] == "404"){
                notify("error", res?.['responseDesc']);
            }

            this.setChartJarakSensorJam = {
              ...this.setChartJarakSensorJam,
              statusFound: false
            }

            this.setChartTinggiJam = {
              ...this.setChartTinggiJam,
              statusFound: false
            }

            this.setChartTinggi_Modus_Jam = {
              ...this.setChartTinggi_Modus_Jam,
              statusFound: false
            }

            this.setChartSuhuJam = {
              ...this.setChartSuhuJam,
              statusFound: false
            }

            this.setChartSuhuModusJam = {
              ...this.setChartSuhuModusJam,
              statusFound: false
            }

            this.setChartSuhuTinggiJam = {
              ...this.setChartSuhuTinggiJam,
              statusFound: false
            }

            this.setChartVolumeJam = {
              ...this.setChartVolumeJam,
              statusFound: false
            }

            this.setState({
              ...this.state,
              loader:{
                ...this.state.loader,
                jarak_sensor_jam: false,
                tinggi_isi_jam: false,
                tinggi_isi_modus_jam: false,
                suhu_tangki_jam: false,
                suhu_tangki_modus_jam: false,
                suhu_tinggi_tangki_jam: false,
                volume_tangki_jam: false
              },
              chartJarakSensorJam: {...this.setChartJarakSensorJam},
              chartTinggiJam: {...this.setChartTinggiJam},
              chartTinggiModusJam: {...this.setChartTinggi_Modus_Jam},
              chartSuhuJam:{...this.setChartSuhuJam},
              chartSuhuModusJam:{...this.setChartSuhuModusJam},
              chartSuhuTinggiJam: {...this.setChartSuhuTinggiJam},
              chartVolumeJam:{...this.setChartVolumeJam}
            })
            
            return
        }

        if (res?.['responseCode'] == "200"){

          this.obj_suhu_tinggi_tangki_perjam_series = {};

          let res_data:any = res?.['data'];

          let obj_temp_tank_forExcel:any;

          if (typeof res_data != 'undefined' && res_data != null){

              // ambil data dengan id devices "BESTAGRO"
              this.arr_json_alldata = [...
                  res_data.filter((res:any)=>{
                      if (typeof res?.['id_device'] != 'undefined' &&
                          res?.['id_device'] != null && 
                          res?.['id_device'].toString().toUpperCase().indexOf("BESTAGRO") != -1)
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

                  // UPDATE TINGGI MINYAK
                  let tinggi_hitung:any = '';

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

                                  let patt_tank_number = new RegExp(/([0-9]+)/,'gi')
                                  let patt_tank_number_exec = patt_tank_number.exec(patt_tank_exec[0]) ?? -1
                                  
                                  // SHOW
                                  // SUHU BERDASARKAN TINGGI
                                  let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                                  let patt_tank_tinggi_num_exec = patt_tank_tinggi_num.exec(data_temperature);
                                  
                                  let patt_tank_tinggi_num_exec_final = patt_tank_tinggi_num_exec != null 
                                          ? parseFloat(patt_tank_tinggi_num_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null

                                  // push data temperature ke dalam variable obj_temp_tank

                                  // key "data" & "data_suhu_tank_num" mempunyai urutan yang sama secara suhu
                                  // misal  => data : ['34.84', '32.66', '32.97', '36.09', '36.09']
                                  //        => data : [10, 7, 5, 3, 1]
                                  
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
                                            : [...obj_temp_tank[nama_tangki]?.['data'], data_arr?.[data_temperature]],

                                      data_suhu_tank_num: obj_temp_tank[nama_tangki]?.['data_suhu_tank_num'] == null ? 
                                            [patt_tank_tinggi_num_exec_final] 
                                            : [...obj_temp_tank[nama_tangki]?.['data_suhu_tank_num'], patt_tank_tinggi_num_exec_final]
                                  }

                                  // AMBIL label tinggi (etc: 1 M, 3 M, 5 M, 7 M, 10 M)

                                  // UPDATE SUHU TINGGI TANGKI
                                  this.updateSuhuTinggiTangki_PerJam(nama_tangki, patt_exec, time_tank, data_arr, data_temperature, obj_temp_tank);
                                  // ... end UPDATE SUHU TINGGI TANGKI
                                  

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


                    // === BALIKKIN LAGI (JARAK SENSOR) ===
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
                                
                                // UPDATE TINGGI MINYAK 
                                let tinggi_hitung:any = '';
                                
                                let find_mst_list:any = this.mst_list_tangki.find(ele_list=>ele_list.api.toLowerCase() == data_tank.toLowerCase());
                                if (find_mst_list){

                                      nama_tangki = find_mst_list?.['name'] ?? '';
                                      title_tangki = find_mst_list?.['title'] ?? '';

                                      // cari tinggi minyak
                                      let tangki_jarak_sensor:any =  data_arr?.[data_jarak_sensor];

                                      // if (nama_tangki == 'tangki_2'){
                                        // INI BARU UPDATE (NANTI AKAN DIHAPUS)
                                          // console.log("INI BARU TANGKI 2, " + time_tank + " -> " + tangki_jarak_sensor)
                                          // console.log("INI BARU TANGKI 2")
                                          // console.log(tangki_jarak_sensor)
                                      // }

                                      if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                                          if (typeof tangki_jarak_sensor == 'string'){
                                            tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                                            // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                                          }else{
                                            // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                                            tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                                          }
                                      }else{tangki_jarak_sensor = 0}

                                      // let ruang_kosong:any = (parseFloat(data_arr?.[data_jarak_sensor]) / 100) - this.mst_avg_t_segitiga?.[nama_tangki];
                                      // let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]).toFixed(2);
                                      let ruang_kosong:any = (tangki_jarak_sensor - this.mst_avg_t_segitiga?.[nama_tangki]);
                                      
                                      // tinggi_hitung = (this.mst_t_tangki?.[nama_tangki] - ruang_kosong).toFixed(3);
                                      // REVISI TINGGI MINYAK PEMBULATAN tiga decimal (TGL 22 FEB '23)
                                      let tinggi_hitung:any = Math.round((this.mst_t_tangki?.[nama_tangki] - ruang_kosong) * 1000) / 1000;

                                      // ... end tinggi minyak

                                      // JIKA HASIL NYA MINUS, maka di nol kan saja 
                                      // REVISI (TGL 22 FEB '23)
                                      if (tinggi_hitung < 0){
                                        tinggi_hitung = 0;
                                      }


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
                                          data_jarak_sensor_m: tangki_jarak_sensor,   // satuan meter
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
                    

                  // LOOPING obj_keys_tinggi (Object.keys(data_arr))

                  })

                  // console.error("(TES) OBJECT TEMP")
                  // console.log(obj_temp_tank)

                  // ... end LOOPING obj_keys_suhu (Object.keys(data_arr))

                  // hitung rata-rata tangki "obj_temp_tank"
                  // === BALIKKIN LAGI (JARAK SENSOR) ===
                  let arr_obj_keys_avg = Object.keys(obj_temp_tank);
                  arr_obj_keys_avg.forEach((ele_tank_name:any) => {

                    // AMBIL DATA SUHU BERDASARKAN KETINGGIAN MINYAK CPO
                    // data_suhu_tank_num
                      let arr_tinggi_suhu_tmp:any = [];
                      let arr_tinggi_suhu_val_tmp:any = [];
                      let arr_obj_tmp_tank_data:any = obj_temp_tank[ele_tank_name]['data'];

                      // let obj_tmp_tank_tinggi_minyak:any = Math.floor(parseFloat(obj_temp_tank[ele_tank_name]['tinggi_minyak']));

                      // REVISI KETINGGIAN SUHU yang KE CELUP  20 feb '23
                      let obj_tmp_tank_tinggi_minyak:any = parseFloat(obj_temp_tank[ele_tank_name]['tinggi_minyak']);
                      // ... <end REVISI KETINGGIAN>

                      if (obj_tmp_tank_tinggi_minyak >= 1){

                          if (arr_obj_tmp_tank_data.length > 0){
                              arr_obj_tmp_tank_data.forEach((ele_suhu_num,idx)=>{

                                // [1, 3, 5, 7, 10]
                                let data_suhu_tank_num_idx:any = obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx];

                                // REVISI KETINGGIAN SUHU yang KE CELUP 20 feb '23

                                  if (obj_tmp_tank_tinggi_minyak < 4)
                                  {
                                      // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                                      if (data_suhu_tank_num_idx == 1){
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  } 
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                                      // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                                      if (data_suhu_tank_num_idx <= 3){    // ambil [1,3]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                                      // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                                      if (data_suhu_tank_num_idx <= 5){    // ambil [1,3,5]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                                      // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                                      if (data_suhu_tank_num_idx <= 7){    // ambil [1,3,5,7]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }
                                  else
                                  if (obj_tmp_tank_tinggi_minyak >= 10){
                                      // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                                      if (data_suhu_tank_num_idx <= 10){    // ambil [1,3,5,7,10]
                                          arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                          arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                      }
                                  }

                                // ... <end REVISI KETINGGIAN>


                                  // if (obj_tmp_tank_tinggi_minyak >= obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]
                                  //     ){
                                  //     arr_tinggi_suhu_tmp.push(obj_temp_tank[ele_tank_name]['data_suhu_tank_num'][idx]);
                                  //     arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[idx]);
                                  // }
                              })  
                          }
                      }else{
                        // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                        if (obj_tmp_tank_tinggi_minyak < 1){

                          let arr_obj_tmp_tank_data:any = obj_temp_tank[ele_tank_name]['data_suhu_tank_num'];
                          let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                          if (findIdx != -1){
                              arr_tinggi_suhu_tmp.push(1);
                              arr_tinggi_suhu_val_tmp.push(obj_temp_tank[ele_tank_name]['data'][findIdx]);
                          }
                          // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                        }
                      }
                    // ... END AMBIL DATA SUHU BERDASARKAN KETINGGIAN MINYAK CPO


                      // let total:any = obj_temp_tank[ele_tank_name]['data'].reduce((tmp:any, val:any)=>{
                      let total:any = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                          return tmp + parseFloat(val);
                      },0)

                      // let avg_tank:any = (total / obj_temp_tank[ele_tank_name]['data'].length).toFixed(3);
                      let avg_tank:any = (total / arr_tinggi_suhu_val_tmp.length).toFixed(3);
                      obj_temp_tank[ele_tank_name] = {
                          ...obj_temp_tank[ele_tank_name],
                          avg: avg_tank,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp]
                      }
                  });
                  // ... <end>

                  
                  // === UPDATE VOLUME TANGKI MINYAK ===
                  // console.log("Tinggi Hitung (VOLUME)")
                  // console.log(obj_temp_tank)

                  
                  // === BALIKKIN LAGI (VOLUME TANGKI) ===
                  let arr_obj_keys_vol = Object.keys(obj_temp_tank);

                  arr_obj_keys_vol.forEach((tangki_name:any)=>{
                    
                    // console.error("HALO TINGGI MINYAK TANGKIIIIIIIIIIII")
                    //   console.error(parseFloat(obj_temp_tank[tangki_name]['tinggi_minyak']).toFixed(3))

                      let tinggi_tmp:any = parseFloat(obj_temp_tank[tangki_name]['tinggi_minyak']).toFixed(3);

                      let avg_tmp:any = parseFloat(obj_temp_tank[tangki_name]['avg']);

                      if (tinggi_tmp != null){
                          
                          // REVISI TINGGI FLOOR
                          // tinggi cpo jangan di bulatkan, ambil floor utk perhitungan volume
                          // 1010,7 -> 1010, sisa desimal 0,7 dikali beda liter

                          // REVISI VOLUME BEDA LITER
                          let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi_tmp) * 100); // angka floor ( 1010 )
                          let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi_tmp) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
                          let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
                          // ... end <REVISI VOLUME BEDA LITER>

                          // if (tinggi_tmp_dec < 1){
                          //     console.error("TINGGI TMP DEC")
                          //     console.error(tinggi_tmp_floor) 
                          //     console.error(tinggi_tmp_all)
                          //     console.error(tinggi_tmp_dec)
                          // }
                          // END REVISI


                          // panggil array json tabel volume tangki yang sesuai
                          let arr_volume:any = this.json_arr_volume_tangki(tangki_name);

                          let findItem:any = arr_volume.find(res=>
                                // parseInt(res.tinggi) == Math.round(tinggi_tmp.toFixed(2) * 100)
                                // in chrome toFixed not rounding (.5) => misal: 5.335 -> 5.33; 5.336 -> 5.34
                                // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi_tmp).toFixed(2))*100)
                                // parseInt(res.tinggi) == Math.round(parseFloat(tinggi_tmp)*100)
                                parseInt(res.tinggi) == tinggi_tmp_floor
                          )
                          // console.error("FIND ITEM MATH ROUND")
                          // console.error(findItem)


                          let tanggal_tangki:any = new Date(obj_temp_tank[tangki_name]['tanggal']);

                          let jenis:any = '';
                          let findCpoPko = this.arr_cpo_pko.find(res=>
                                    res.name == tangki_name &&
                                    (
                                      (new Date(res.datebegin) <= tanggal_tangki
                                          && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                                      )
                                      ||
                                      (
                                        (new Date(res.datebegin) <= tanggal_tangki)
                                          && (res.datelast == '' || res.datelast == null)
                                      )
                                    ) 
                                    // && 
                                    // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                          )

                          if (findCpoPko){
                              jenis = findCpoPko?.['jenis'];
                              // console.log("kalkulasi_volume_tangki findCpoPko");
                              // console.log(findCpoPko)
                          }

                          if (findItem){
                  
                              let volume_tbl:any = 0;
                              let beda_liter_mst:any = 0;
                              let beda_liter_hitung:any = 0;

                              // VOLUME LITER ATAU KG tangki
                              volume_tbl = parseFloat(findItem.volume);
                              beda_liter_mst = parseFloat(findItem.beda_liter);

                              // * 1000 / 1000 => tujuan nya decimal 5 bisa dibulatkan
                              beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 
                              // dikali dengan berat jenis nya apakah cpo atau pko

                              let faktor_koreksi_temp:any;
                              let volume_prev:any = volume_tbl;

                              // REVISI VOLUME BEDA LITER

                              let volume_tbl_plus_beda_liter:any;
                              if (typeof findItem?.['volume'] != 'undefined' &&
                                    findItem?.['volume'] != null)
                              {
                                  volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                              }

                              volume_tbl = volume_tbl_plus_beda_liter;

                              // end <REVISI VOLUME BEDA LITER>

                              if (jenis != '' && jenis != null){

                                  let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis);

                                  let find_berat_jenis:any = arr_berat_jenis.find(res=>
                                        Math.round(parseFloat(res.temperature)) == Math.round(avg_tmp)
                                    );


                                  // if (tangki_name == "tangki_3"){
                                    // console.error("tinggi tmp tangki_3 : " + tinggi_tmp)
                                    // console.error("tanggal jam tmp tangki_3 : " + formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'))
                                    // console.error("volume tbl tangki_3 : " + volume_tbl)
                                    // console.error("berat jenis tangki_3 : " + find_berat_jenis?.['berat_jenis'])
                                  // }

                                  // console.error("CEK SINI GET ALL DATA (VOLUME PREV)")
                                  // console.error(volume_tbl)

                                  if (find_berat_jenis){
                                      volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];
                                      // volume_prev = volume_tbl;   // just info volume sebelumnya
                                  }

                                   // SINI SINI
                                    // console.error("CEK SINI GET ALL DATA")
                                    // console.error(findItem)
                                    
                                    // console.error("CEK SINI GET ALL DATA (TIME TANK)")
                                    // console.error(time_tank)
                                    // console.error("CEK SINI GET ALL BERAT JENIS")
                                    // console.error(find_berat_jenis)
                                    // console.error("CEK SINI GET ALL VOLUME TBL x BERAT JENIS")
                                    // console.error(volume_tbl)

                                  // faktor koreksi
                                  // console.error("CEK SINI GET ALL ERROR avg_tmp")
                                  // console.error(Math.round(parseFloat(avg_tmp)))

                                  faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(avg_tmp)));
                                  if (faktor_koreksi_temp != null){
                                      // console.error('volume tbl ',volume_tbl)
                                      // console.log(tangki_name)
                                      // console.error('faktor koreksi : ',faktor_koreksi_temp)
                                      // console.error('volume tbl :  ',volume_tbl)
                                      volume_tbl *= faktor_koreksi_temp;
                                      // console.error('volume tbl (final) :  ',volume_tbl)
                                  }

                                  obj_temp_tank[tangki_name] = {
                                      ...obj_temp_tank[tangki_name],
                                      volume_prev,    // volume master
                                      volume_tbl_plus_beda_liter,
                                      berat_jenis: find_berat_jenis?.['berat_jenis'],
                                      faktor_koreksi: faktor_koreksi_temp,
                                      tinggi_tmp_floor,
                                      tinggi_tmp_all,
                                      tinggi_tmp_dec,
                                      beda_liter_mst,
                                      beda_liter_hitung,
                                      // volume: volume_tbl.toFixed(2),
                                      volume: typeof(volume_tbl) != 'undefined' && volume_tbl != null ? Math.round(parseFloat(volume_tbl) * 100) / 100 : 0,
                                      jenis
                                  }

                                  // console.error(obj_temp_tank[tangki_name])
                                  
                                  // alert(JSON.stringify(arr_berat_jenis))
                                  // volume_tbl => volume dari tabel
                                  
                              }

                            // ... end (dikali dengan berat jenis nya apakah cpo atau pko)

                          }
                          // else{
                          //     console.error("NAN VOLUME TABLE")
                          //     console.log(tangki_name)
                          //     console.log(tinggi_tmp.toFixed(2) * 100)
                          //     console.log(Math.round(tinggi_tmp.toFixed(2) * 100))
                          // }

                      }
                      

                  })
                  // ... end BALIKKIN

                  // === FOR EXCEL EXPORT ===

                  Object.keys(obj_temp_tank).forEach((ele_tank_name,idx_tank_name)=>{

                      if (typeof obj_temp_tank_forExcel != 'undefined' &&
                          obj_temp_tank_forExcel != null)
                      {
                          obj_temp_tank_forExcel = [
                              ...obj_temp_tank_forExcel,
                              {
                                ...obj_temp_tank[ele_tank_name],
                                tangki: ele_tank_name
                              }
                          ]

                          // JIKA MAU OBJECT, {tangki_1: [{...}]}
                          // obj_temp_tank_forExcel = {
                          //     ...obj_temp_tank_forExcel,
                          //     [ele_tank_name]: [
                          //         ...obj_temp_tank_forExcel[ele_tank_name],
                          //         {
                          //           tangki: ele_tank_name,
                          //           ...obj_temp_tank[ele_tank_name]
                          //         }
                          //     ]
                          // }
                      }
                      else{

                          obj_temp_tank_forExcel = [
                              {
                                ...obj_temp_tank[ele_tank_name],
                                tangki: ele_tank_name
                              }
                          ]

                          // JIKA MAU OBJECT, {tangki_1: [{...}]}
                          // obj_temp_tank_forExcel = {
                          //     ...obj_temp_tank_forExcel,
                          //     [ele_tank_name]: [
                          //         {
                          //           ...obj_temp_tank[ele_tank_name],
                          //           tangki: ele_tank_name
                          //         }
                          //     ]
                          //     // [tangki_name]: {...obj_temp_tank[tangki_name]}
                          // }
                      }
                    
                  })
                  
                  // FOR EXCEL ARRAY
                  this.data_Export = obj_temp_tank_forExcel.map((ele,idx)=>{

                      let suhu_1_m:any = '', suhu_3_m = '', suhu_5_m = '', suhu_7_m = '', suhu_10_m = '';
                      let avg_tinggi_suhu:any = ele?.['avg_tinggi_suhu'];
                      
                      let avg_tinggi_suhu_val:any = ele?.['avg_tinggi_suhu_val'];
                      avg_tinggi_suhu_val = avg_tinggi_suhu_val.map((ele_suhu)=>{
                        return parseFloat(ele_suhu)
                      })

                      if (Array.isArray(avg_tinggi_suhu)){
                          if (avg_tinggi_suhu.length > 0){
                              avg_tinggi_suhu.forEach((ele_tinggi_suhu,idx_tinggi_suhu)=>{
                                  switch(ele_tinggi_suhu){
                                    case 1 : suhu_1_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                                    case 3 : suhu_3_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                                    case 5 : suhu_5_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                                    case 7 : suhu_7_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                                    case 10 : suhu_10_m = avg_tinggi_suhu_val[idx_tinggi_suhu]; break;
                                  }
                              })
                          }
                      }

                      return {
                          tangki: ele?.['title'],
                          tanggal: ele?.['tanggal'],
                          jenis: ele?.['jenis'],
                          data_jarak_sensor_m: ele?.['data_jarak_sensor_m'],
                          suhu_1_m,
                          suhu_3_m,
                          suhu_5_m,
                          suhu_7_m,
                          suhu_10_m,
                          tinggi: ele?.['tinggi_minyak'],
                          suhu: parseFloat(ele?.['avg']),
                          volume: ele?.['volume'] ?? 0
                      }
                  })

                  // ... end === FOR EXCEL EXPORT ===
                  console.log("FOR EXCEL EXPORT ====")
                  console.log(obj_temp_tank_forExcel)
                  console.log(this.data_Export)




                  // ... end <VOLUME TANGKI>

                  // taruh hasil rata-rata nya ke data_suhu_tangki_per_jam
                  // looping obj_temp_tank

                  // === BALIKKIN LAGI (JARAK SENSOR) ===
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
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['avg']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
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
                      idx_arr_perjam_series = -1
                      
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
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['tinggi_minyak']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
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
                       if (!tangki_tinggi_exists){
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

                      
                      // JARAK SENSOR TANGKI

                      idx_arr_perjam_series = -1
                      let data_jarak_sensor_temp:any = [];

                      let tangki_jarak_sensor_exists:boolean = false
                      let findJarakSensorIdx:any = this.data_jaraksensor_tangki_perjam_series.findIndex((res:any)=>res.name == obj_temp_tank[tangki_name]?.['title']);
                      if (findJarakSensorIdx != -1){
                          tangki_jarak_sensor_exists = true;
                          data_jarak_sensor_temp = [...this.data_jaraksensor_tangki_perjam_series[findJarakSensorIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findJarakSensorIdx;
                      }
                      data_jarak_sensor_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: parseFloat(obj_temp_tank?.[tangki_name]?.['data_jarak_sensor_m']),
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
                          }
                      );
                       // SORTING data_tinggi_temp
                       if (data_jarak_sensor_temp.length > 0) {

                        data_jarak_sensor_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })
                      }
                      // store data ke "data_jaraksensor_tangki_perjam_series" untuk nanti di simpan ke setChartJarakSensorJam
                        if (!tangki_tinggi_exists){
                          this.data_jaraksensor_tangki_perjam_series.push(
                              {name:title_tangki, data:[...data_jarak_sensor_temp]}
                          )
                      }else{
                          this.data_jaraksensor_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_jaraksensor_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_jarak_sensor_temp]
                          }
                      }

                      // ... end sorting 



                      // ...end <JARAK SENSOR TANGKI PER JAM>
                      

                      // VOLUME TANGKI PER JAM

                      idx_arr_perjam_series = -1
                      let data_volume_temp:any = [];

                      let tangki_volume_exists:boolean = false
                      let findVolumeIdx:any = this.data_volume_tangki_perjam_series.findIndex((res:any)=>res.name == obj_temp_tank[tangki_name]?.['title']);
                      if (findVolumeIdx != -1){
                          tangki_volume_exists = true;
                          data_volume_temp = [...this.data_volume_tangki_perjam_series[findVolumeIdx]?.['data']];

                          // posisi index
                          idx_arr_perjam_series = findVolumeIdx;
                      }

                      data_volume_temp.push(
                          {
                            x: formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm:ss'),
                            y: typeof (obj_temp_tank?.[tangki_name]?.['volume']) != 'undefined' &&
                                 (obj_temp_tank?.[tangki_name]?.['volume']) != null 
                                ? 
                                  parseFloat(obj_temp_tank?.[tangki_name]?.['volume'])
                                : 0,
                            x_time: new Date(time_tank).getTime(),
                            jenis: obj_temp_tank?.[tangki_name]?.['jenis']
                          }
                      );

                      // SORTING data_tinggi_temp
                      if (data_volume_temp.length > 0) {

                        data_volume_temp.sort((a,b)=>{
                            return a['x_time'] - b['x_time'];
                        })

                      }
                      // ... end sorting 

                      // store data ke "data_volume_tangki_perjam_series" untuk nanti di simpan ke setChartVolumeJam
                      if (!tangki_volume_exists){
                          this.data_volume_tangki_perjam_series.push(
                              {name:title_tangki, data:[...data_volume_temp]}
                          )
                      }else{
                          this.data_volume_tangki_perjam_series[idx_arr_perjam_series] = {
                              ...this.data_volume_tangki_perjam_series[idx_arr_perjam_series],
                              data: [...data_volume_temp] 
                          }
                      }

                      // console.error("!!!! OBJ TEMP TANK DATA VOLUME TANGKI PER JAM SERIES !!!!")
                      // console.log(this.data_volume_tangki_perjam_series)

                      // ... end VOLUME TANGKI PER JAM

                  });
                  // ... end BALIKKIN


                  // ... end obj_temp_tank

                  // push categories (tanggal tz ke array "data_suhu_tangki_perjam_categories")
                  // this.data_suhu_tangki_perjam_categories.push(time_tank);
                  // this.data_tinggi_tangki_perjam_categories.push(time_tank);

                  // REVISI UNTUK IRREGULAR SERIES ({x:..., y: ....})

                  // === BALIKKIN LAGI (JARAK SENSOR) ===
                  this.data_suhu_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  this.data_tinggi_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  this.data_volume_tangki_perjam_categories.push(
                        new Date(formatDate(new Date(time_tank),'YYYY-MM-DD HH:mm')).getTime());
                  ;
                  // ... end BALIKKIN

                  
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

              // // === BALIKKIN LAGI (JARAK SENSOR) ===
              // console.log("DATA SUHU TANGKI PER JAM SERIES")
              // console.log(this.data_suhu_tangki_perjam_series)
              
              // console.log("DATA TINGGI TANGKI PER JAM CATEGORIES")
              // console.log(this.data_tinggi_tangki_perjam_categories)

              // console.log("DATA VOLUME TANGKI PER JAM CATEGORIES")
              // console.log(this.data_volume_tangki_perjam_categories)
              // ... END BALIKKIN

              // let min_tgl:any = null;
              // let max_tgl:any = null;

              // let min_suhu_tgl:any = null;
              // let max_suhu_tgl:any = null;

              // if (this.data_tinggi_tangki_perjam_categories.length > 0){
              //     min_tgl = Math.min.apply(null, this.data_tinggi_tangki_perjam_categories)
              //     max_tgl = Math.max.apply(null, this.data_tinggi_tangki_perjam_categories)
              // }
              // if (this.data_suhu_tangki_perjam_categories.length > 0){
              //     min_suhu_tgl = Math.min.apply(null, this.data_suhu_tangki_perjam_categories)
              //     max_suhu_tgl = Math.max.apply(null, this.data_suhu_tangki_perjam_categories)
              // }
              // if (this.data_volume_tangki_perjam_categories.length > 0){
              //     min_suhu_tgl = Math.min.apply(null, this.data_volume_tangki_perjam_categories)
              //     max_suhu_tgl = Math.max.apply(null, this.data_volume_tangki_perjam_categories)
              // }

              // === BALIKKIN LAGI (JARAK SENSOR) ===
              // SET CHART SUHU JAM


              this.setChartSuhuJam = {
                ...this.setChartSuhuJam,
                statusFound: this.data_suhu_tangki_perjam_series.length > 0 ? true : false,
                series: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_series)),
                options:{
                    ...this.setChartSuhuJam.options,
                    xaxis:{
                      ...this.setChartSuhuJam.options.xaxis,
                      // min: typeof min_suhu_tgl != 'undefined' && min_suhu_tgl != null ? new Date(min_suhu_tgl).getTime() : 0,
                      // max: typeof max_suhu_tgl != 'undefined' && max_suhu_tgl != null ? new Date(max_suhu_tgl).getTime() : 0
                      // type:'datetime',
                      // categories: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartSuhuJam.options.dataLabels,
                      enabled: this.statusChecked?.['suhu'] ?? false
                    }
                }
              }

              // SET CHART TINGGI JAM
              this.setChartJarakSensorJam = {
                ...this.setChartJarakSensorJam,
                statusFound: this.data_jaraksensor_tangki_perjam_series.length > 0 ? true : false,
                series: JSON.parse(JSON.stringify(this.data_jaraksensor_tangki_perjam_series)),
                options:{
                    ...this.setChartJarakSensorJam.options,
                    xaxis:{
                      ...this.setChartJarakSensorJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartJarakSensorJam.options.dataLabels,
                      enabled: this.statusChecked?.['jarak_sensor'] ?? false
                    }
                }
              }

              // SET CHART TINGGI JAM
              this.setChartTinggiJam = {
                ...this.setChartTinggiJam,
                statusFound: this.data_tinggi_tangki_perjam_series.length > 0 ? true : false,
                series: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_series)),
                options:{
                    ...this.setChartTinggiJam.options,
                    xaxis:{
                      ...this.setChartTinggiJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
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

              // SET CHART TINGGI MODUS JAM (angka yang sering muncul)

              // DATA MODUS (DATA YANG SERING MUNCUL)
              // getAllData_Modus => ambil data value y yang paling sering muncul

              // TINGGI MODUS
              let arr_tinggi_modus_jam_series:any = this.getAllData_Modus(this.data_tinggi_tangki_perjam_series)
              // console.error("ARR TINGGI MODUS JAM FINAL")
              // console.error(arr_tinggi_modus_jam_series)
              if (arr_tinggi_modus_jam_series.length == 0){
                arr_tinggi_modus_jam_series = []
              }else{
                arr_tinggi_modus_jam_series = JSON.parse(JSON.stringify(arr_tinggi_modus_jam_series));
              }
              
              // SUHU MODUS 

              let arr_suhu_modus_jam_series:any = this.getAllData_Suhu_Modus(arr_tinggi_modus_jam_series, this.data_suhu_tangki_perjam_series)

              // let status_process_suhuModus:boolean = false;

              if (arr_suhu_modus_jam_series.length == 0){
                arr_suhu_modus_jam_series = []
                // status_process_suhuModus = true
              }else{
                arr_suhu_modus_jam_series = JSON.parse(JSON.stringify(arr_suhu_modus_jam_series));
                // status_process_suhuModus = true
              }

              // console.error('ARR SUHU MODUS JAM FINAL')
              // console.error(this.data_suhu_tangki_perjam_series)


              this.setChartTinggi_Modus_Jam = {
                ...this.setChartTinggi_Modus_Jam,
                statusFound: arr_tinggi_modus_jam_series.length > 0 ? true : false,
                // series: JSON.parse(JSON.stringify(arr_tinggi_modus_jam_series)),
                series: arr_tinggi_modus_jam_series,
                options:{
                    ...this.setChartTinggi_Modus_Jam.options,
                    xaxis:{
                      ...this.setChartTinggi_Modus_Jam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartTinggi_Modus_Jam.options.dataLabels,
                      enabled: this.statusChecked?.['tinggi_modus'] ?? false
                    }
                }
              }

              
              // series: JSON.parse(JSON.stringify(arr_suhu_modus_jam_series)),
              this.setChartSuhuModusJam = {
                ...this.setChartSuhuModusJam,
                statusFound: arr_suhu_modus_jam_series.length > 0 ? true : false,
                series: arr_suhu_modus_jam_series,
                options:{
                    ...this.setChartSuhuModusJam.options,
                    xaxis:{
                      ...this.setChartSuhuModusJam.options.xaxis,
                      // min: typeof min_suhu_tgl != 'undefined' && min_suhu_tgl != null ? new Date(min_suhu_tgl).getTime() : 0,
                      // max: typeof max_suhu_tgl != 'undefined' && max_suhu_tgl != null ? new Date(max_suhu_tgl).getTime() : 0
                      // type:'datetime',
                      // categories: JSON.parse(JSON.stringify(this.data_suhu_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartSuhuModusJam.options.dataLabels,
                      enabled: this.statusChecked?.['suhu_modus'] ?? false
                    }
                }
              }

              // SET CHART VOLUME JAM

              this.setChartVolumeJam = {
                ...this.setChartVolumeJam,
                statusFound: this.data_volume_tangki_perjam_series.length > 0 ? true : false,
                series: JSON.parse(JSON.stringify(this.data_volume_tangki_perjam_series)),
                options:{
                    ...this.setChartVolumeJam.options,
                    xaxis:{
                      ...this.setChartVolumeJam.options.xaxis,
                      // min: typeof min_tgl != 'undefined' && min_tgl != null ? new Date(min_tgl).getTime() : 0,
                      // max: typeof max_tgl != 'undefined' && max_tgl != null ? new Date(max_tgl).getTime() : 0
                      // type: 'datetime',
                      // min: formatDate(new Date(time_tank),'YYYY-MM-DD'
                      // // categories untuk type 'category'
                      // categories: JSON.parse(JSON.stringify(this.data_tinggi_tangki_perjam_categories))
                    },
                    dataLabels:{
                      ...this.setChartVolumeJam.options.dataLabels,
                      enabled: this.statusChecked?.['volume'] ?? false
                    }
                }
              }
              // ... END BALIKKIN

              // console.log("setChartSuhuJam")
              // console.log(this.setChartSuhuJam)

              // // === BALIKKIN LAGI (JARAK SENSOR) ===


              // SET SUHU TINGGI 
              let suhu_tinggi_tangki_name_selected:any = this.state.chartSuhuTinggiJam.suhuTinggiSelected.name;
              let arr_final_suhutinggi_tangki_selected:any = [];
              
              let found_suhu_Tinggi:boolean = false;

              if (typeof suhu_tinggi_tangki_name_selected != 'undefined' &&
                  typeof this.obj_suhu_tinggi_tangki_perjam_series?.[suhu_tinggi_tangki_name_selected] != 'undefined'){

                  arr_final_suhutinggi_tangki_selected = [...this.obj_suhu_tinggi_tangki_perjam_series[suhu_tinggi_tangki_name_selected]];
              }

              if (Object.keys(this.obj_suhu_tinggi_tangki_perjam_series).length > 0){
                  found_suhu_Tinggi = true;
              }


              // alert(JSON.stringify(arr_final_suhutinggi_tangki_selected))

              // this.setState({
              //     ...this.state,
              //     loader:{
              //         ...this.state.loader,
              //         suhu_tinggi_tangki_jam: false,
              //     },
              //     waktu:{
              //       tanggal: formatDate(new Date(time_first),'DD MMMM YYYY'),
              //       tanggal_jam: formatDate(new Date(time_first),'DD MMMM YYYY HH:mm:ss')
              //     },
              //     chartSuhuTinggiJam: {
              //       ...this.state.chartSuhuTinggiJam,
              //       statusFound: true,
              //       isDisabled: false,
              //       suhuTinggiSelected:{
              //         ...this.state.chartSuhuTinggiJam.suhuTinggiSelected
              //       },
              //       series:[
              //         ...arr_final_suhutinggi_tangki_selected
              //       ],
              //       options:{
              //           ...this.state.chartSuhuTinggiJam.options,
              //           dataLabels:{
              //               ...this.state.chartSuhuTinggiJam.options.dataLabels,
              //               enabled: this.statusChecked?.['suhu_tinggi'] ?? false
              //           }
              //       }
              //     }
              // })  

                this.setState({
                  ...this.state,
                  loader:{
                    ...this.state.loader,
                    jarak_sensor_jam: false,
                    suhu_tangki_jam: false,
                    suhu_tangki_modus_jam: false,
                    suhu_tinggi_tangki_jam: false,
                    tinggi_isi_jam: false,
                    tinggi_isi_modus_jam: false,
                    volume_tangki_jam: false
                  },
                  waktu:{
                      tanggal: formatDate(new Date(time_first),'DD MMMM YYYY'),
                      tanggal_jam: formatDate(new Date(time_first),'DD MMMM YYYY HH:mm:ss')
                  },
                  chartJarakSensorJam: {...this.setChartJarakSensorJam},
                  chartSuhuJam: {...this.setChartSuhuJam},
                  chartSuhuModusJam: {...this.setChartSuhuModusJam},
                  chartTinggiJam: {...this.setChartTinggiJam},
                  chartTinggiModusJam: {...this.setChartTinggi_Modus_Jam},
                  chartVolumeJam: {...this.setChartVolumeJam},
                  chartSuhuTinggiJam: {
                    ...this.state.chartSuhuTinggiJam,
                    statusFound: found_suhu_Tinggi,
                    isDisabled: false,
                    suhuTinggiSelected:{
                      ...this.state.chartSuhuTinggiJam.suhuTinggiSelected
                    },
                    series:[
                      ...arr_final_suhutinggi_tangki_selected
                    ],
                    options:{
                        ...this.state.chartSuhuTinggiJam.options,
                        dataLabels:{
                            ...this.state.chartSuhuTinggiJam.options.dataLabels,
                            enabled: this.statusChecked?.['suhu_tinggi'] ?? false
                        }
                    }
                  }
                })

                setTimeout(()=>{
                  console.error("FINAL SET STATE")
                  console.error(this.state)
                  console.log("obj_temp_tank_forExcel")
                  console.log(obj_temp_tank_forExcel)

                  // console.log("data_jaraksensor_tangki_perjam_series")
                  // console.log(this.data_jaraksensor_tangki_perjam_series)
                  // console.log("data_tinggi_tangki_perjam_series")
                  // console.log(this.data_tinggi_tangki_perjam_series)

                  // console.log(_.MER)

                },100)

              // ... END BALIKKIN

              // console.log(this.obj_suhu_tinggi_tangki_perjam_series)


              // console.log("INI ADALAH TIME TANK")
              // console.log(time_tank)

              // setTimeout(()=>{
                // console.log("CHART TINGGI JAM")
                // console.log(this.state.chartTinggiJam)

                // console.log("set chart suhu jam")
                // console.log(this.data_suhu_tangki_perjam_categories)
                // console.log(min_tgl)
                // console.log(max_tgl)


                // console.error("===DATA VOLUME TANGKI PER JAM SERIES===")
                // console.error(this.data_volume_tangki_perjam_series)
              // },500)

              // console.log("array json tangki ALL DATA")
              // console.log(this.arr_json_alldata)
              // console.log(this.arr_json_tangki_last);
          }
        }
      })
    }

    getAllData_Suhu_Modus(arr_tinggi:any, arr_suhu_param:any){
        // ambil suhu data berdasarkan tinggi cpo / pko
        let arr_temp:any = [];
        console.error("GET ALL TINGGI MODUS")
        console.error(arr_tinggi)
        console.error("GET ALL SUHU MODUS")
        console.error(arr_suhu_param)

        let arr_suhu_param_filter:any = [];

        if (Array.isArray(arr_suhu_param)){

            arr_suhu_param.forEach((elefor,idxfor)=>{
                let nama_tangki_suhu:any = elefor?.['name']
                let data_tangki_suhu:any = elefor?.['data']
                
                let filter_tangki_tinggi:any = arr_tinggi.filter(elefil=>elefil?.['name'] == nama_tangki_suhu);

                // COCOKKIN HASIL FILTER TINGGI DENGAN SUHU DARI SISI TANGGAL (x_time)
                

                data_tangki_suhu.forEach((elesuhu, idxsuhu)=>{

                  let find_xtime_tinggi:any = filter_tangki_tinggi[0]['data'].find(eletinggifind=>eletinggifind?.['x_time'] == elesuhu?.['x_time'])
                  if (find_xtime_tinggi){
                      // console.error("FILTER TANGKI TINGGI")
                      // console.error(find_xtime_tinggi)

                      // cari jika ada nama tangki yang sama, maka tinggal push ke data
                      let findIdxTangki_inSuhu = arr_temp.findIndex(elesuhu => elesuhu?.['name'] == nama_tangki_suhu)
                      if (findIdxTangki_inSuhu == -1){
                          // jika tidak ada, create nama tangki baru
                          arr_temp = [
                            ...arr_temp,
                            {
                              name: nama_tangki_suhu,
                              data: [{...elesuhu}]
                            }
                          ]
                      }
                      else
                      {
                          arr_temp[findIdxTangki_inSuhu]['data'] = [
                              ...arr_temp[findIdxTangki_inSuhu]['data'],
                              {...elesuhu}
                          ]
                      }
                  }
                })

                console.error("INJECT KE ARR_TEMP SUHU")
                console.error(arr_temp)
                // console.error(filter_tangki_tinggi)
            })

        }

        console.error("GET ALL SUHU MODUS (FILTER)")
        console.error(arr_temp)

        return arr_temp;
        
    }

    getAllData_Modus(arr_param:any){
        console.error("=== MODUS MODUS MODUS DATA ===")
        console.log(arr_param)

        let arr_temp:any = [];

        // === SAMPLE DATA ===
        // [{name : 'Tangki 1', 
        //  data :
        //    [ 
        //      {jenis: "PKO", x: "2023-02-23 06:00:13", x_time: 1677106813000, y: 3.861},
        //      {jenis: "PKO", x: "2023-02-23 06:01:18", x_time: 1677106878000, y: 3.844}
        //    ]
        // },
        // {name : 'Tangki 2', 
        //  data :
        //    [ 
        //      {jenis: "PKO", x: "2023-02-23 06:00:13", x_time: 1677106813000, y: 3.861},
        //      {jenis: "PKO", x: "2023-02-23 06:01:18", x_time: 1677106878000, y: 3.844}
        //    ]
        // }]
        
        if (Array.isArray(arr_param)){

            if (arr_param.length > 0){

              arr_param.forEach((ele,idx)=>{

                  // nama tangki 
                  let ele_name:any = ele?.['name'];
                  // data array tangki
                  let ele_data:any = ele?.['data'];

                  if (typeof ele_name != 'undefined' && ele_name != null){

                      if (Array.isArray(ele_data)){
                          if (ele_data.length > 0){

                              // ambil semua angka y di simpan single ke array
                              let arr_val_y:any = ele_data.map((ele_val, idx_val) => {
                                  return parseFloat(ele_val?.['y'])
                              })

                              // hanya sebagai referensi master
                              let arr_val_y_countBy = _.countBy(arr_val_y);

                              // hanya menghasilkan satu record array yang paling maksimal
                              let getFrequentItem:any = _(arr_val_y)
                                                  .countBy()
                                                  .entries()
                                                  .maxBy(_.last)
                                                  ;
                              
                              if (getFrequentItem.length >= 1){
                                  // bila ada occurance (kemunculan) yang sama, maka ambil angka paling maksimal
                                  let arr_val_y_countBy_entries = Object.entries(arr_val_y_countBy);

                                  // filter yang memiliki kemunculan angka yang sama (misal, [[12.34, 2], [9.56, 2]]) => [2] == [2]
                                  let filter_val_y_countBy_entries = arr_val_y_countBy_entries.filter(elefil => elefil[1] == getFrequentItem[1]);

                                  let arr_getMax_Values = filter_val_y_countBy_entries.map((ele_max,idx_max)=>{
                                      return parseFloat(ele_max[0])
                                  })

                                  // ambil angka yang paling maksimal (misal : 12.34)
                                  let getMax_Value:any = Math.max.apply(null, arr_getMax_Values)

                                  // ambil data lengkap object key lainnya berdasarkan angka maksimal
                                  // hanya ada satu angka saja yang akan di ambil
                                  let filter_getMax_Value = ele_data.filter((elemax) => parseFloat(elemax?.['y']) == parseFloat(getMax_Value));

                                  // console.error("arr_val_y")
                                  // console.error(arr_val_y)
                                  // console.error("arr_val_y_countBy")
                                  // console.error(arr_val_y_countBy)
                                  // console.error("getFrequentItem")
                                  // console.error(getFrequentItem)
                                  // console.error("filter_val_y_countBy_entries")
                                  // console.error(filter_val_y_countBy_entries)
                                  
                                  // console.error("arr_getMax_Values")
                                  // console.error(arr_getMax_Values)
                                  // console.error("getMax_Value")
                                  // console.error(getMax_Value)

                                  // console.error("filter_getMax_Value")
                                  // console.error(filter_getMax_Value)

                                  arr_temp.push(
                                    {
                                      name: ele_name,
                                      data: JSON.parse(JSON.stringify(filter_getMax_Value))
                                    }
                                  )
                                  // masukkan data tangki dalam bentuk object
                                  // if (typeof arr_temp?.[ele_name] == 'undefined' || 
                                  //      arr_temp?.[ele_name] == null)
                                  // {
                                      // arr_temp[ele_name] = JSON.parse(JSON.stringify(filter_getMax_Value));
                                  // }

                              }


                          }
                      }
                  }
              })

              // console.error("ARR TEMP FINAL")
              // console.error(arr_temp)

              return arr_temp

            }
        }

    }

    kalkulasi_tinggi_tangki(callback:any){
        let obj_keys:any = Object.keys(this.arr_json_tangki_last);

        let arr_tangki_name:any = [];
        let arr_tangki_tinggi:any = [];

        let arr_tangki_temp:any = [];

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

                    // if (nama_tangki == 'tangki_2'){
                    // INI BARU UPDATE (NANTI AKAN DIHAPUS)
                      // console.log("INI BARU TANGKI 2, " + time_tank + " -> " + tangki_jarak_sensor)
                      // console.log("INI BARU TANGKI 2")
                      // console.log(tangki_jarak_sensor)
                    // }
                    
                    
                    if (typeof tangki_jarak_sensor != 'undefined' && tangki_jarak_sensor != null){
                        if (typeof tangki_jarak_sensor == 'string'){
                          // tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100).toFixed(2);
                          tangki_jarak_sensor = (parseFloat(tangki_jarak_sensor) / 100);
                        }else{
                          // tangki_jarak_sensor = (tangki_jarak_sensor / 100).toFixed(2);
                          tangki_jarak_sensor = (tangki_jarak_sensor / 100);
                        }
                    }else{tangki_jarak_sensor = 0}

                    // let ruang_kosong_tangki:any = (tangki_jarak_sensor - mst_avg_t_segitiga_temp).toFixed(2);
                    let ruang_kosong_tangki:any = (tangki_jarak_sensor - mst_avg_t_segitiga_temp);
                    // let tinggi_minyak:any = (mst_t_tangki_temp - ruang_kosong_tangki).toFixed(2);

                    // let tinggi_minyak:any = (mst_t_tangki_temp - ruang_kosong_tangki).toFixed(3);

                    // REVISI TINGGI MINYAK PEMBULATAN tiga decimal (TGL 22 FEB '23)
                    let tinggi_minyak:any = Math.round((mst_t_tangki_temp - ruang_kosong_tangki) * 1000) / 1000;

                    // JIKA HASIL NYA MINUS, maka di nol kan saja 
                    // REVISI (TGL 22 FEB '23)
                    if (tinggi_minyak < 0){
                      tinggi_minyak = 0;
                    }

                    this.arr_json_tangki_last[tangki_name]['jarak_sensor'] = tinggi_minyak;

                    // taruh di temp dahulu, baru di store ke setState (karena setState tidak bisa update di looping multi data)
                    temp_updatedState_tinggi['realtime'] = {

                        ...temp_updatedState_tinggi['realtime'],
                        [tangki_name]: {
                            ...this.state.realtime[tangki_name],
                            tinggi: parseFloat(tinggi_minyak),
                        }
                    }
                    console.log("KONDISI REAL TIME")
                    console.log("Jarak Sensor : " + tangki_jarak_sensor)
                    console.log("Avg Delta Temp : " + mst_avg_t_segitiga_temp)

                    console.log("Mst Tinggi Tangki Temp : " + mst_t_tangki_temp)
                    console.log("Ruang kosong Tangki : " + ruang_kosong_tangki)
                    console.log(temp_updatedState_tinggi)
                    
                    // cari title tangki (Tangki 1, Tangki 2, dst...)
                    let find_tangki_title:any = this.mst_list_tangki.find(res_tank=>res_tank.name == tangki_name);
                    if (find_tangki_title){
                      let tanggal:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'DD MMMM YYYY');
                      let jam:any = formatDate(new Date(this.arr_json_tangki_last?.[tangki_name]?.['time']),'HH:mm');

                      // TITLE TINGGI ISI TANGKI (m)
                      arr_tangki_name.push(
                          // [find_tangki_title['title'], tanggal, jam]
                          find_tangki_title['title']
                      );

                    }
                    arr_tangki_tinggi.push(parseFloat(tinggi_minyak));

                    // ... <end>
                  
                }

            })

            arr_tangki_name.forEach((ele, idx)=>{
                let patt = new RegExp(/([0-9]+)/,'gi');
                let match:any = patt.exec(ele[0]);
                let angka_temp:any = 0;
                if (match){
                  angka_temp = match[0];
                }

                arr_tangki_temp.push(
                  {x: ele, y: arr_tangki_tinggi[idx], 
                    tangki_num: parseFloat(angka_temp)}
                ) 
                
            })

            // sort
            if (arr_tangki_temp){
              arr_tangki_temp.sort((a,b)=>{
                return a['tangki_num'] - b['tangki_num']
              })
            }
            // ... end sort

              // alert(JSON.stringify(arr_tangki_temp))

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
                          // categories: [...arr_tangki_name]    // ["Tangki 1","Tangki 2","Tangki 3","Tangki 4"]
                        }
                    },
                    series: [
                      {
                        // data:[...arr_tangki_tinggi],  // [4.55, 8.81, ...]
                        data:[...arr_tangki_temp], 
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
                console.log("ini adalah state (KALKULASI TINGGI TANGKI)")
                console.log(this.state)
                callback()
              })

      }
    }
          
    kalkulasi_volume_tangki(callback:any){
        // console.log("TINGGI MINYAK REAL TIME")
        let realtime:any = this.state?.['realtime'];
        console.log("VOLUME TANGKI")
        console.log(realtime)

        // LOOPING TANGKI NAME (realtime)
        let temp_update_volume:any = {};
        
        temp_update_volume['realtime'] = {

            ...this.state['realtime']
        }

        Object.keys(realtime).forEach((tangki_name:any)=>{

            // let tinggi:any = realtime?.[tangki_name]?.['tinggi'] ?? null;
            let tinggi:any = realtime?.[tangki_name]?.['tinggi'] != null 
                  ? parseFloat(realtime?.[tangki_name]?.['tinggi']).toFixed(3)
                  : null

            // REVISI VOLUME BEDA LITER
            let tinggi_tmp_floor:any = Math.floor(parseFloat(tinggi) * 100); // angka floor ( 1010 )
            let tinggi_tmp_all:any = parseFloat((parseFloat(tinggi) * 100).toFixed(3));   // angka plus decimal ( 1010,7 )
            let tinggi_tmp_dec:any = (Math.round((tinggi_tmp_all - tinggi_tmp_floor) * 1000)) / 1000;   // (1010,7777 - 1010 = 0,778)
            // ... end <REVISI VOLUME BEDA LITER>

            if (tinggi != null && tinggi != "-" && tinggi != ""){
                // panggil array json tabel volume tangki yang sesuai
                let arr_volume:any = this.json_arr_volume_tangki(tangki_name);
                

                let findItem:any = arr_volume.find(res=>
                      // parseInt(res.tinggi) == Math.round(tinggi.toFixed(2) * 100)
                      // parseInt(res.tinggi) == Math.round(parseFloat(parseFloat(tinggi).toFixed(2))*100)
                      // parseInt(res.tinggi) == Math.round(parseFloat(tinggi)*100)
                      parseInt(res.tinggi) == tinggi_tmp_floor
                )

                // this.arr_cpo_pko
                console.log("REAL TIME STATE : ===")
                console.log(this.state.realtime)
                
                let tanggal_tangki:any = new Date(this.arr_json_tangki_last[tangki_name]['time']);

                let jenis:any = '';

                let findCpoPko = this.arr_cpo_pko.find(res=>
                          res.name == tangki_name &&
                          (
                            (new Date(res.datebegin) <= tanggal_tangki
                                && (res.datelast != '' && res.datelast != null && new Date(res.datelast) >= tanggal_tangki)
                            )
                            ||
                            (
                              (new Date(res.datebegin) <= tanggal_tangki)
                                && (res.datelast == '' || res.datelast == null)
                            )
                          ) 
                          // && 
                          // (res.datelast == null || res.datelast == '' || new Date(res.datelast) >= tanggal_tangki)
                )
                if (findCpoPko){
                    jenis = findCpoPko?.['jenis'];
                    console.log("kalkulasi_volume_tangki findCpoPko");
                    console.log(findCpoPko)
                }

                // let arr_beratjenis:any = this.json_arr_berat_jenis_tangki()


                if (findItem){
                  
                  let volume_tbl:any = 0;
                  let beda_liter_mst:any = 0;
                  let beda_liter_hitung:any = 0;

                  let berat_jenis:any;

                  // VOLUME LITER ATAU KG tangki
                  volume_tbl = parseFloat(findItem.volume);
                  beda_liter_mst = parseFloat(findItem.beda_liter);

                  // * 1000 / 1000 => tujuan nya decimal 5 bisa dibulatkan
                  beda_liter_hitung = Math.round((beda_liter_mst * tinggi_tmp_dec) * 1000) / 1000; // cth : (dari 1010,7) 0.7 * 4613 => 3229,1 
                  // dikali dengan berat jenis nya apakah cpo atau pko

                  let faktor_koreksi_temp:any;
                  let volume_prev:any = volume_tbl;

                  // REVISI VOLUME BEDA LITER

                  let volume_tbl_plus_beda_liter:any;
                  if (typeof findItem?.['volume'] != 'undefined' &&
                        findItem?.['volume'] != null)
                  {
                      volume_tbl_plus_beda_liter = volume_tbl + beda_liter_hitung;
                  }

                  volume_tbl = volume_tbl_plus_beda_liter;

                  // end <REVISI VOLUME BEDA LITER>

                  if (jenis != '' && jenis != null){
                      let arr_berat_jenis:any = this.json_arr_berat_jenis_tangki(jenis);

                      let suhu_last:any = this.state.realtime?.[tangki_name]?.['suhu'];

                      // sini update

                      let find_berat_jenis:any = arr_berat_jenis.find(res=>
                            Math.round(parseFloat(res.temperature)) == Math.round(parseFloat(suhu_last))
                        );


                      if (find_berat_jenis){
                        volume_tbl = volume_tbl * find_berat_jenis?.['berat_jenis'];

                        berat_jenis = find_berat_jenis?.['berat_jenis'];
                        // volume_prev = volume_tbl;   // just info volume sebelumnya
                      }

                      // SINI SINI
                      // console.error("CEK SINI GET REAL TIME")
                      // console.error(findItem)
                      // console.error("CEK SINI GET REAL TIME BERAT JENIS")
                      // console.error(find_berat_jenis)
                      // console.error("CEK SINI GET VOLUME TBL x BERAT JENIS")
                      // console.error(volume_tbl)

                      // faktor koreksi

                      faktor_koreksi_temp = this.faktor_koreksi(volume_tbl, Math.round(parseFloat(suhu_last)));
                      if (faktor_koreksi_temp != null){
                          // volume_tbl *= faktor_koreksi_temp.toFixed(2);
                          volume_tbl *= faktor_koreksi_temp;
                      }
                      
                      // alert(JSON.stringify(arr_berat_jenis))
                      // volume_tbl => volume dari tabel
                      
                  }
                  // ... end (dikali dengan berat jenis nya apakah cpo atau pko)

                  
                  temp_update_volume['realtime'] = {
                      ...temp_update_volume['realtime'],
                      [tangki_name]: {
                        ...this.state.realtime?.[tangki_name],
                        volume_prev,
                        volume_tbl_plus_beda_liter,
                        berat_jenis,
                        faktor_koreksi: faktor_koreksi_temp,
                        tinggi_tmp_floor,
                        tinggi_tmp_all,
                        tinggi_tmp_dec,
                        beda_liter_mst,
                        beda_liter_hitung,
                        volume: volume_tbl.toFixed(2),
                        jenis
                      }
                  }

                }
            }
        })

        // end LOOPING TANGKI NAME (realtime)

        // UPDATE DI STATE


        setTimeout(()=>{

          this.setState({
            ...this.state,
            ...temp_update_volume
          })

          setTimeout(()=>{
            console.log("REALTIME STATE (VOLUME)")
            console.log(this.state.realtime)
            callback()
          },100)
        })
      }


    faktor_koreksi(volume:any, suhu:any){
        if (volume == null || suhu == null ||
            typeof volume == 'undefined' ||
            typeof suhu == 'undefined'){
            return null
        }


        if (typeof volume == 'number' && 
            typeof suhu == 'number'){

            let lambda:any = 0.0000348;
            let hitung_koreksi:any;
            hitung_koreksi = 1 + (lambda * (suhu - 36));

            return hitung_koreksi;
        }

        return null
    }


    fungsi(){
      // this.setState({
      //   ...this.state,
      //   realtime:{
      //       ...this.state.realtime,
      //       'tangki_1':{
      //           ...this.state.realtime.tangki_1,
      //           volume:123456
      //       },
      //       'tes':'wefw'
      //   }
      // })

      console.log("STATE")
      console.log(this.state)
    }

    json_arr_berat_jenis_tangki(jenis:any){
        let arr_temp:any = [];

        switch (jenis.toLowerCase()){
          case 'cpo':
              arr_temp = JSON.parse(JSON.stringify(berat_jenis_cpo_json));
              break;
          case 'pko':
              arr_temp = JSON.parse(JSON.stringify(berat_jenis_pko_json));
              break;
        }

        return arr_temp;
    }

    json_arr_volume_tangki(tangki_name:any){
        let arr_temp:any = [];

        switch (tangki_name){
          case 'tangki_1':
              arr_temp = JSON.parse(JSON.stringify(tangki_1_json));
              break;
          case 'tangki_2':
              arr_temp = JSON.parse(JSON.stringify(tangki_2_json));
              break;
          case 'tangki_3':
              arr_temp = JSON.parse(JSON.stringify(tangki_3_json));
              break;
          case 'tangki_4':
              arr_temp = JSON.parse(JSON.stringify(tangki_4_json));
              break;
        }

        return arr_temp;
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
                let temp_arr_suhu_num_exec_final:any = [];
                let temp_arr_suhu_num_all_raw:any = []; // semua data [13,15,17,19,21]

                let arr_tinggi_suhu_tmp:any = [];
                let arr_tinggi_suhu_val_tmp:any = [];

                // cari ada kata "Temperature Tank"
                obj_keys_tangki.forEach((temperat:any)=>{
                    if (temperat.toLowerCase().indexOf("temperature tank") != -1){

                        // SUHU BERDASARKAN TINGGI
                        let patt_tank_tinggi_num = new RegExp(/(tinggi [0-9]+.?M)/,'gi')
                        let patt_tank_tinggi_num_exec = patt_tank_tinggi_num.exec(temperat);

                        let patt_tank_tinggi_num_exec_final = patt_tank_tinggi_num_exec != null 
                                          ? parseFloat(patt_tank_tinggi_num_exec[0].replace(/(tinggi|M)/gi,'').trim())
                                          : null
                        
                        temp_arr_suhu_num_exec_final.push(patt_tank_tinggi_num_exec_final);

                        temp_arr_suhu_num_all_raw.push(this.arr_json_tangki_last?.[tangki_name]?.[temperat]);

                        // ... END
                        
                        // temp_arr.push(parseFloat(this.arr_json_tangki_last[tangki_name][temperat]));

                    }
                })
                
                if (temp_arr_suhu_num_all_raw.length > 0){

                    let obj_tmp_tank_tinggi_minyak:any = Math.floor(parseFloat(temp_updatedState_suhu['realtime']?.[tangki_name]?.['tinggi']));

                    // console.error(temp_updatedState_suhu)
                    // console.error(this.arr_json_tangki_last[tangki_name])

                    // BERDASARKAN KETINGGIAN SUHU
                    if (obj_tmp_tank_tinggi_minyak >= 1){

                        if (temp_arr_suhu_num_exec_final.length > 0){
                            temp_arr_suhu_num_exec_final.forEach((ele_suhu_num,idx)=>{

                                // REVISI KETINGGIAN SUHU yang KE CELUP 20 feb '23

                                if (obj_tmp_tank_tinggi_minyak < 4)
                                {
                                    // jika tinggi di bawah 4 m, maka ambil ketinggian suhu [1]
                                    if (temp_arr_suhu_num_exec_final[idx] == 1){
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 4 && obj_tmp_tank_tinggi_minyak < 6){
                                    // jika tinggi di bawah 4 m s/d 5.99, maka ambil ketinggian suhu [1,3]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 3){    // ambil [1,3]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 6 && obj_tmp_tank_tinggi_minyak < 8){
                                    // jika tinggi di bawah 6 m s/d 7.99, maka ambil ketinggian suhu [1,3,5]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 5){    // ambil [1,3,5]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 8 && obj_tmp_tank_tinggi_minyak < 10){
                                    // jika tinggi di bawah 8 m s/d 9.99, maka ambil ketinggian suhu [1,3,5,7]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 7){    // ambil [1,3,5,7]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                else
                                if (obj_tmp_tank_tinggi_minyak >= 10){
                                    // jika tinggi di bawah 10 m, maka ambil ketinggian suhu [1,3,5,7,10]
                                    if (temp_arr_suhu_num_exec_final[idx] <= 10){    // ambil [1,3,5,7,10]
                                        arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                        arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                    }
                                }
                                // ... <end REVISI KETINGGIAN>
                                  
                                // if (obj_tmp_tank_tinggi_minyak >= temp_arr_suhu_num_exec_final[idx])
                                // {
                                //     arr_tinggi_suhu_tmp.push(temp_arr_suhu_num_exec_final[idx]);
                                //     arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[idx]);
                                // }
                            })  
                        }
                    }
                    else{
                        // JIKA MINUS, MAKA INJECT KETINGGIAN 1 M
                        if (obj_tmp_tank_tinggi_minyak < 1){

                          let arr_obj_tmp_tank_data:any = temp_arr_suhu_num_exec_final;
                          let findIdx = arr_obj_tmp_tank_data.findIndex(ele=>ele == 1);
                          if (findIdx != -1){
                              arr_tinggi_suhu_tmp.push(1);
                              arr_tinggi_suhu_val_tmp.push(temp_arr_suhu_num_all_raw[findIdx]);
                          }
                          // arr_tinggi_suhu_val_tmp.push(arr_obj_tmp_tank_data[1]);
                        }
                    }

                    // totalkan semua 
                    // let total_temp_arr = temp_arr.reduce((acc:any, val:any)=>{
                    //     return acc + val
                    // },0)

                    // total SUHU BERDASARKAN TINGGI
                    let total_temp_arr = arr_tinggi_suhu_val_tmp.reduce((tmp:any, val:any)=>{
                        return tmp + parseFloat(val)
                    },0)
                    
                    // di rata-ratakan
                    // let avg_temp_arr = (total_temp_arr / temp_arr.length).toFixed(3);
                    let avg_temp_arr = (total_temp_arr / arr_tinggi_suhu_val_tmp.length).toFixed(3);

                    temp_updatedState_suhu['realtime'] = {
                        ...temp_updatedState_suhu['realtime'],
                        [tangki_name]: {
                          ...this.state['realtime'][tangki_name],
                          suhu: avg_temp_arr,
                          suhu_tank_num: temp_arr_suhu_num_exec_final,
                          suhu_tank_num_raw: temp_arr_suhu_num_all_raw,
                          avg_tinggi_suhu: [...arr_tinggi_suhu_tmp],
                          avg_tinggi_suhu_val: [...arr_tinggi_suhu_val_tmp]
                      }
                    }
                }
                
            })
            // ... <end loop>


              this.setState({
                ...this.state,
                loader:{
                  ...this.state.loader,
                  suhu_tangki:false,
                  suhu_tangki_modus_jam: false,
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

    kalkulasi_set_others_tangki(callback:any){
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
              callback();
            })
      }
  }


  onChangeSelectSuhuTinggiFilter(e:any, action:any){

    if (action != 'clear'){

      let getFirstTangkiList:any = this.mst_list_tangki.length > 0 ? 
            {...this.mst_list_tangki.filter(res=>res.value == e.value)[0]} 
            : {}

      this.getFirstTangki_Default = {...getFirstTangkiList}
      
      let arr_final_suhutinggi_tangki_selected:any = [];
      let obj_selected:any = this.obj_suhu_tinggi_tangki_perjam_series?.[this.getFirstTangki_Default.name];
      if (typeof obj_selected == 'undefined' || obj_selected == null)
      {
          notify('error', e.value + ' tidak ada !')
          return
      }


      arr_final_suhutinggi_tangki_selected = [...this.obj_suhu_tinggi_tangki_perjam_series[this.getFirstTangki_Default.name]];

      this.setState({
        ...this.state,
        chartSuhuTinggiJam: {
              ...this.state.chartSuhuTinggiJam,
              series:[
                  ...arr_final_suhutinggi_tangki_selected
              ],
              suhuTinggiSelected: {...getFirstTangkiList}
        }
      })

    }
    else
    {
        this.setState({
          ...this.state,
          chartSuhuTinggiJam: {
                ...this.state.chartSuhuTinggiJam,
                series:[],
                suhuTinggiSelected: {}
          }
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

          if (this.state.show.datepicker && dateSelected == null){
              notify("error","Tanggal harus di isi !");
              return
          }

          if (this.state.show.timepicker && (timeSelected[0] == null
                || timeSelected[1] == null)
              )
          {
              notify("error","Waktu harus di isi !");
              return
          }
          if (this.state.show.timepicker){
              let firstDate:any = formatDate(new Date(),'YYYY-MM-DD') + ' ' + timeSelected[0];
              let secondDate:any = formatDate(new Date(),'YYYY-MM-DD') + ' ' + timeSelected[1];
              if (firstDate > secondDate){
                notify("error","Waktu Kedua harus lebih besar dari Waktu Pertama !")
                return
              }
          }



          if (dateSelected != null || timeSelected != null)
          {
            if (this.state.show.datepicker && !this.state.show.timepicker){

                this.data_jaraksensor_tangki_perjam_series = []
                this.data_jaraksensor_tangki_perjam_categories = []
                this.data_suhu_tangki_perjam_series = []
                this.data_suhu_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_categories = []
                this.data_tinggi_tangki_perjam_series = []
                this.data_volume_tangki_perjam_categories = []
                this.data_volume_tangki_perjam_series = []

                this.obj_suhu_tinggi_tangki_perjam_series = {};

                this.setState({
                  ...this.state,
                  loader:{
                    ...this.state.loader,
                    jarak_sensor_jam: true,
                    tinggi_isi_jam: true,
                    tinggi_isi_modus_jam: true,
                    suhu_tangki_jam: true,
                    suhu_tangki_modus_jam: true,
                    suhu_tinggi_tangki_jam: true,
                    volume_tangki_jam: true
                  },
                });

                setTimeout(()=>{
                  this.getAllData(this.state.dateSelected, this.state.dateSelected,'00:00','23:59')
                },200)
            }
            else
            {
              if (this.state.show.datepicker && this.state.show.timepicker){
                if (dateSelected != null && 
                        timeSelected[0] != null &&
                        timeSelected[1] != null){
                    
                    this.data_jaraksensor_tangki_perjam_series = []
                    this.data_jaraksensor_tangki_perjam_categories = []
                    this.data_suhu_tangki_perjam_series = []
                    this.data_suhu_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_categories = []
                    this.data_tinggi_tangki_perjam_series = []
                    this.data_volume_tangki_perjam_categories = []
                    this.data_volume_tangki_perjam_series = []

                    this.obj_suhu_tinggi_tangki_perjam_series = {};

                    this.setState({
                      ...this.state,
                      loader:{
                        ...this.state.loader,
                        jarak_sensor_jam: true,
                        tinggi_isi_jam: true,
                        tinggi_isi_modus_jam: true,
                        suhu_tangki_jam: true,
                        suhu_tangki_modus_jam: true,
                        suhu_tinggi_tangki_jam: true,
                        volume_tangki_jam: true
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
        this.data_jaraksensor_tangki_perjam_series = []
        this.data_jaraksensor_tangki_perjam_categories = []
        this.data_suhu_tangki_perjam_series = []
        this.data_suhu_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_categories = []
        this.data_tinggi_tangki_perjam_series = []
        this.data_volume_tangki_perjam_categories = []
        this.data_volume_tangki_perjam_series = []

        this.obj_suhu_tinggi_tangki_perjam_series = {};

        this.setState({
          ...this.state,
          loader:{
            ...this.state.loader,
            jarak_sensor_jam: true,
            tinggi_isi_jam: true,
            tinggi_isi_modus_jam: true,
            suhu_tangki_jam: true,
            suhu_tangki_modus_jam: true,
            suhu_tinggi_tangki_jam: true,
            volume_tangki_jam: true
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

          let arr_maxDate_ForPerHour:any;
          let maxDate_ForPerHour:any;
          let get_maxDate_ForPerHour:any;
          let get_hourbegin_ForPerHour:any;
          let get_hourlast_ForPerHour:any;

          if (typeof this.arr_date_realtime != 'undefined' && this.arr_date_realtime != null){
            arr_maxDate_ForPerHour = this.arr_date_realtime.map(ele=>ele?.['time_tank_getTime']);
            maxDate_ForPerHour = Math.max.apply(null, arr_maxDate_ForPerHour);
            get_maxDate_ForPerHour = this.arr_date_realtime.filter(ele=>ele?.['time_tank_getTime'] == maxDate_ForPerHour)[0];
            get_hourbegin_ForPerHour = get_maxDate_ForPerHour?.['hourbegin'];
            get_hourlast_ForPerHour = get_maxDate_ForPerHour?.['hourlast'];
          }

          this.getAllData(this.tanggal_max_tangki_last, this.tanggal_max_tangki_last
                    , get_hourbegin_ForPerHour, get_hourlast_ForPerHour)
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

  checkChartJam(val:any, type:'jarak_sensor'|'tinggi'|'suhu_jam'|'volume_jam'|'suhu_tinggi_jam'|
                'tinggi_modus'|'suhu_modus'){
    
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
                      return !isNaN(val) ? (Math.round(parseFloat(val)*1000)/1000) + " m" : ''
                    },
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if (type == 'tinggi_modus'){
          this.statusChecked['tinggi_modus'] = val.target.checked

          console.log('check chart JAM')
          console.log(this.state)
          this.setState({
            ...this.state,
            chartTinggiModusJam: {
                ...this.state.chartTinggiModusJam,
                options:{
                  ...this.state.chartTinggiModusJam.options,
                  xaxis:{
                    ...this.state.chartTinggiModusJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartTinggiModusJam.options.dataLabels,
                    formatter:(val:any)=>{
                      return !isNaN(val) ? (Math.round(parseFloat(val)*1000)/1000) + " m" : ''
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
      else if(type == 'suhu_modus'){
          this.statusChecked['suhu_modus'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuModusJam: {
                ...this.state.chartSuhuModusJam,
                options:{
                  ...this.state.chartSuhuModusJam.options,
                  xaxis:{
                    ...this.state.chartSuhuModusJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuModusJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'suhu_tinggi_jam'){
          this.statusChecked['suhu_tinggi'] = val.target.checked

          this.setState({
            ...this.state,
            chartSuhuTinggiJam: {
                ...this.state.chartSuhuTinggiJam,
                options:{
                  ...this.state.chartSuhuTinggiJam.options,
                  xaxis:{
                    ...this.state.chartSuhuTinggiJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartSuhuTinggiJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'jarak_sensor'){
          this.statusChecked['jarak_sensor'] = val.target.checked

          this.setState({
            ...this.state,
            chartJarakSensorJam: {
                ...this.state.chartJarakSensorJam,
                options:{
                  ...this.state.chartJarakSensorJam.options,
                  xaxis:{
                    ...this.state.chartJarakSensorJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartJarakSensorJam.options.dataLabels,
                    enabled: val.target.checked
                  }
                }
            }
          })
      }
      else if(type == 'volume_jam'){
          this.statusChecked['volume'] = val.target.checked

          this.setState({
            ...this.state,
            chartVolumeJam: {
                ...this.state.chartVolumeJam,
                options:{
                  ...this.state.chartVolumeJam.options,
                  xaxis:{
                    ...this.state.chartVolumeJam.options.xaxis,
                  },
                  dataLabels:{
                    ...this.state.chartVolumeJam.options.dataLabels,
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
               

                {/* <PanggilToast ref={(response)=>(this.componentRef = response)} /> */}

                {/* <ReactToPrint
                  trigger={()=>{
                    return <a href="#">Print this out !</a>;
                  }}
                  content={()=>this.componentRef}
                /> */}

              <ToastContainer 
                draggable
                pauseOnHover
              />

              {/* <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
              /> */}

              {/* <button onClick={()=>this.fungsi()}> Click </button> */}
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
                                <div className='header-banner'>
                                      {/* <img src={BlueWavyCurve} 
                                          className='header-banner-img'/> */}
                                </div>
                                <Row className='dashtangki-row-1'>
                                    <Col>

                                        <Row>
                                            <Col>
                                                <h3 className='dashtangki-page-title'>
                                                    <span className='bg-gradient-primary dashtangki-mdi-span'>
                                                        <Icon path={mdiChartBarStacked} size={1} color= "white"/>
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
                                                                      {
                                                                        // typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' 
                                                                        ele.title + 
                                                                          (typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                            this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                          ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                          : '')
                                                                        }
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

                                                                  <div style={{position:'relative', zIndex:2}}>
                                                                    <h4 className='text-white'>Tinggi : {this.state.realtime?.[ele.name].tinggi} M</h4>
                                                                    <h4 className='text-white'>Suhu : {this.state.realtime?.[ele.name].suhu} °C</h4>
                                                                    <h4 className='text-white'>Volume : { this.state.realtime?.[ele.name].volume != "-" ? new Number(this.state.realtime?.[ele.name].volume).toLocaleString('en-us') : '-'} kg</h4>
                                                                  </div>

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
                                            <div className='d-flex flex-column flex-md-row '>

                                                <div className='width-tinggi-isi'>
                                                    <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m )</h5>
                                                    {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}
                                                    <Col>
                                                        
                                                        <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                            {/* <ReactFC
                                                                type="column3d"
                                                                width="100%"
                                                                height="30%"
                                                                dataFormat="JSON"
                                                                dataSource={dataSource}
                                                            /> */}


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
                                                                wrapperClass="classTinggiIsi"
                                                                visible={this.state.loader.tinggi_isi}
                                                                ariaLabel="three-circles-rotating"
                                                                outerCircleColor="#008ffb"
                                                                innerCircleColor="#00e396"
                                                                middleCircleColor="#feb019"
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
                                                              (<div id = "chartdiv" style={{width:"100%", height:"300px",
                                                                opacity:!this.state.loader.tinggi_isi ? 1 : 0}}></div>)
                                                            }
                                                            {/* { 
                                                              !this.state.loader.tinggi_isi &&
                                                                (<div className='w-100 '>
                                                                  <ReactApexChart 
                                                                          options={this.state.chartTinggi.options} 
                                                                          series={this.state.chartTinggi.series} 
                                                                          type="bar" height={350}
                                                                  />
                                                                </div>)
                                                            } */}

                                                        </div>
                                                    </Col>
                                                </div>

                                                <div className='width-suhu-tangki realtime-suhu-tangki-prop pl-3'>
                                                    <h5 className='dashtangki-title'>Suhu Tangki ( °C )</h5>
                                                    {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}
                                                    {this.state.loader.suhu_tangki && 
                                                        (
                                                          <div className='realtime-suhu-tangki-loader'>
                                                              <Col className='d-flex align-items-center justify-content-center w-100 h-100'>
                                                                <ThreeCircles
                                                                      height="100"
                                                                      width="100"
                                                                      color="#4fa94d"
                                                                      wrapperStyle={{}}
                                                                      wrapperClass=""
                                                                      visible={this.state.loader.suhu_tangki}
                                                                      ariaLabel="three-circles-rotating"
                                                                      outerCircleColor="#008ffb"
                                                                      innerCircleColor="#00e396"
                                                                      middleCircleColor="#feb019"
                                                                />
                                                              </Col>
                                                          </div>
                                                        )
                                                    }
                                                    <div className='d-flex justify-content-start flex-nowrap customclass-snap'>

                                                        {
                                                          !this.state.loader.suhu_tangki && 
                                                              this.mst_list_tangki.map((ele,idx)=>{
                                                                return (
                                                                  <div className='snap-col' key = {ele.name}>
                                                                    <ThermometerFC 
                                                                          caption = {
                                                                                ele.title + 
                                                                                (typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                                this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                                ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                                : '')
                                                                          } 
                                                                          subcaption2={this.state.realtime?.[ele.name]?.['tanggal_jam']}
                                                                          subcaption={this.state.realtime?.[ele.name]?.['tanggal']} 
                                                                          value={parseFloat(this.state.realtime?.[ele.name]?.['suhu'])}/>
                                                                  </div>
                                                                )
                                                              })
                                                        } 
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>

                                        <Row className='mt-3'>
                                          
                                            <Col className='d-flex justify-content-start flex-nowrap customclass-snap'>
                                                {/* <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/> */}
                                               
                                                

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
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal_jam})</span></div> */}

                                            <Col className='d-flex flex-nowrap customclass-snap'>
                                                {/* <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/>
                                                <ReactFC {...this.chartConfigs_Suhu}/> */}
                                                {
                                                  this.mst_list_tangki.map((ele,idx)=>{
                                                    return (
                                                      <div className='snap-col' key = {ele.name}>
                                                        <CylinderFC 
                                                                caption = {ele.title + 
                                                                        (typeof this.state.realtime?.[ele.name]?.['jenis'] != 'undefined' &&
                                                                        this.state.realtime?.[ele.name]?.['jenis'] != null 
                                                                        ? ' (' + this.state.realtime?.[ele.name]?.['jenis'] + ')'
                                                                        : '')
                                                                      } 
                                                                subcaption2={this.state.realtime?.[ele.name]?.['tanggal_jam']}
                                                                subcaption={this.state.realtime?.[ele.name]?.['tanggal']} 
                                                                value={this.state.realtime?.[ele.name]?.['volume']} plottooltext_hover="Volume"/>
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
                                                <div className='d-flex flex-md-row flex-column justify-content-start align-items-start'> 

                                                    <div className='d-flex justify-content-center filter-css-titles mb-2 mb-md-0'>
                                                        <div className='filter-css-title'>Filter :</div>
                                                        <Select options={this.options_filter} 
                                                            className="select-class"
                                                            // defaultValue={this.options_filter.filter(({value})=> value == 'time')} // set default value
                                                            tabSelectsValue={false} isClearable={true}
                                                            onChange={(e, {action})=>this.onChangeSelectFilter(e, action)}
                                                        />
                                                    </div>

                                                    {
                                                      this.state.show.datepicker && 
                                                        <div className='d-flex mb-2 mb-lg-0'>
                                                          <div className='d-block d-md-none filter-css-title'>Tanggal :</div>
                                                          <DatePicker 
                                                            dateFormat="dd MMMM yyyy"
                                                            selected={this.state.dateSelected} 
                                                            onChange={(date) => this.setFilterDate(date)}
                                                          />
                                                        </div>
                                                    }

                                                    {
                                                      this.state.show.timepicker && 
                                                        // <TimeRange 
                                                        //         onChange={(e)=>{this.onChangeTimePicker(e)}} 
                                                        //         onStartTimeChange={(e)=>{this.onStartTimeClick(e)}}
                                                        //         startMoment={this.state.timeSelected.startMoment} 
                                                        //         endMoment={this.state.timeSelected.endMoment} 
                                                        // />
                                                        <div className='d-flex mb-2 mb-lg-0'>
                                                            <div className='d-block d-md-none filter-css-title'>Waktu :</div>
                                                            <TimeRangePicker 
                                                              locale="id"
                                                              minTime="00:00:00"
                                                              maxTime="23:59:59"
                                                              minutePlaceholder="mm"
                                                              hourPlaceholder="hh"
                                                              required={true}
                                                              openClockOnFocus = {false}
                                                              onChange={(e)=>{this.onChangeTimePicker(e)}} 
                                                              value={this.state.timeSelected}
                                                              onBlur={(e)=>{this.onBlurTimePicker(e)}}/>
                                                        </div>
                                                    }

                                                    <div className=' btn-filter-ml w-100 mb-2 mb-md-0 mt-3 mt-md-0'>
                                                      <button className='btn btn-sm btn-primary mediaClassFilter' onClick={()=>this.clickFilter()}>Filter</button>
                                                    </div>

                                                    <div className=' w-100 d-flex justify-content-end align-items-center btn-filter-ml'>
                                                      
                                                      <div className='d-flex custom-btn-print'>
                                                          <ReactToPrint
                                                              content={() => this.componentRef}
                                                              // concept create watermark
                                                              //   const PrintElem = document.createElement('div');
                                                              //   const header = 
                                                              //     `<img src="${Img_Facebook}" alt="" class="watermark"/>` + 
                                                              //     `<div class="page-footer">I'm The Footer</div>`;
                                                              //   PrintElem.innerHTML = header;
                                                              //   return PrintElem;
                                                              // }}
                                                              trigger={() => <button className="btn btn-sm btn-success mediaClassFilter custom-btn-pdf">PDF</button>}
                                                          />

                                                          <div style={{marginLeft:'5px'}} className='custom-btn-excel-parent'>
                                                                <ExcelFile filename={'Tangki_' + formatDate(new Date(),'YYYY-MM-DD HH:mm:ss').toString()} element={<button className="btn btn-sm btn-success custom-btn-excel">Excel</button>}>
                                                                    {/* <ExcelSheet dataSet = {this.data_Export} name = "Organization" /> */}

                                                                    <ExcelSheet data={this.data_Export} name="Result">
                                                                        <ExcelColumn label="Tangki" value="tangki" />
                                                                        <ExcelColumn label="Tanggal" value="tanggal" />
                                                                        <ExcelColumn label="Jenis" value="jenis"/>
                                                                        <ExcelColumn label="Jarak Sensor (m)" value="data_jarak_sensor_m"/>
                                                                        <ExcelColumn label="Suhu 1 M (°C)" value="suhu_1_m"/>
                                                                        <ExcelColumn label="Suhu 3 M (°C)" value="suhu_3_m"/>
                                                                        <ExcelColumn label="Suhu 5 M (°C)" value="suhu_5_m"/>
                                                                        <ExcelColumn label="Suhu 7 M (°C)" value="suhu_7_m"/>
                                                                        <ExcelColumn label="Suhu 10 M (°C)" value="suhu_10_m"/>
                                                                        <ExcelColumn label="Suhu Average (°C)" value="suhu"/>
                                                                        <ExcelColumn label="Tinggi (m)" value="tinggi"/>
                                                                        <ExcelColumn label="Volume (kg)" value="volume"/>

                                                                        {/* <ExcelColumn label="Marital Status"
                                                                                    value={(col) => col.is_married ? "Married" : "Single"}/> */}
                                                                    </ExcelSheet>

                                                                    {/* <ExcelSheet data={dataSet2} name="Leaves">
                                                                        <ExcelColumn label="Name" value="name"/>
                                                                        <ExcelColumn label="Total Leaves" value="total"/>
                                                                        <ExcelColumn label="Remaining Leaves" value="remaining"/>
                                                                    </ExcelSheet> */}
                                                                </ExcelFile>
                                                          </div>
                                                      </div>

                                                    </div>


                                                </div>
                                            </Col>

                                            {/* <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m / jam )</h5> */}
                                            {/* <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div> */}
                                        </Row>

                                        <div 
                                              ref={(response)=>this.componentRef=response}>

                                            {/* TINGGI MODUS JAM */}
                                            <Row className='mt-2'>
                                                <hr></hr>
                                                <div className='d-flex flex-nowrap customclass-snap gap-3'>

                                                    <div className='modus-flex'>
                                                        <div className='d-flex justify-content-between'>

                                                            <div className='d-flex justify-content-start align-items-start gap-2'
                                                                    style={{width:'100%'}}>
                                                              <div className='d-flex justify-content-center align-items-start'>
                                                                  <img src = {Tank} width="30" height="30" />
                                                              </div>
                                                              <div className='dashtangki-title-width'>
                                                                {/* MODUS TINGGI */}
                                                                  <h5 className='dashtangki-title'>Tinggi Isi Tangki</h5>
                                                                  <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                                  <div className='d-flex justify-content-end checkbox-shift'>

                                                                      <Form.Check type={'checkbox'}>
                                                                          <Form.Check.Input type={'checkbox'} 
                                                                              onChange={(val)=>{this.checkChartJam(val,'tinggi_modus')}} 
                                                                              defaultChecked={this.state.chartTinggiModusJam.options.dataLabels.enabled}/>
                                                                          <Form.Check.Label className='show-data-label-font'>{`Show Data Label`}</Form.Check.Label>
                                                                          {/* <Form.Control.Feedback type="valid">
                                                                            You did it! 
                                                                          </Form.Control.Feedback> */}
                                                                      </Form.Check>
                                                                  </div>
                                                              </div>
                                                            </div>

                                                            <div>
                                                                    {/* <Form.Check
                                                                      inline
                                                                      label="1"
                                                                      name="group1"
                                                                      type='checkbox'
                                                                      id={`inline-${'1'}-1`}
                                                                    /> */}
                                                                    
                                                            </div>


                                                        </div>
                                                        <Col> 
                                                            <div id="chart" className='d-flex justify-content-center align-items-center'>

                                                              <ThreeCircles
                                                                    height="100"
                                                                    width="100"
                                                                    color="#4fa94d"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass="mb-3"
                                                                    visible={this.state.loader.tinggi_isi_jam}
                                                                    ariaLabel="three-circles-rotating"
                                                                    outerCircleColor="#008ffb"
                                                                    innerCircleColor="#00e396"
                                                                    middleCircleColor="#feb019"
                                                                />

                                                                { 
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='w-100'>
                                                                        <ReactApexChart 
                                                                              options={this.state.chartTinggiModusJam.options} 
                                                                              series={this.state.chartTinggiModusJam.series} 
                                                                              type="area" 
                                                                              height={350} />
                                                                    </div>
                                                                }

                                                                {
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    !this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                        <img src = {No_Found} className="nofound-class" />
                                                                        <div className='nofound-label'> No Data Found </div>
                                                                    </div>
                                                                }

                                                                
                                                            </div>
                                                        </Col>
                                                    </div>

                                                    <div className='modus-flex'>

                                                        <div className='d-flex justify-content-between'>

                                                            <div className='d-flex justify-content-start align-items-start gap-2'
                                                                    style={{width:'100%'}}>
                                                              <div className='d-flex justify-content-center align-items-start'>
                                                                  <img src = {TermSensor} width="30" height="30" />
                                                              </div>
                                                              <div className='dashtangki-title-width'>
                                                                {/* MODUS SUHU*/}
                                                                  <h5 className='dashtangki-title'>Suhu Tangki</h5>
                                                                  <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                                  <div className='d-flex justify-content-end checkbox-shift'>

                                                                      <Form.Check type={'checkbox'}>
                                                                          <Form.Check.Input type={'checkbox'} 
                                                                                onChange={(val)=>{this.checkChartJam(val,'suhu_modus')}}
                                                                                defaultChecked={this.state.chartSuhuModusJam.options.dataLabels.enabled}
                                                                          />
                                                                          <Form.Check.Label className='show-data-label-font'>{`Show Data Label`}</Form.Check.Label>
                                                                          {/* <Form.Control.Feedback type="valid">
                                                                            You did it! 
                                                                          </Form.Control.Feedback> */}
                                                                      </Form.Check>
                                                                  </div>
                                                              </div>
                                                            </div>

                                                            <div>
                                                                    {/* <Form.Check
                                                                      inline
                                                                      label="1"
                                                                      name="group1"
                                                                      type='checkbox'
                                                                      id={`inline-${'1'}-1`}
                                                                    /> */}
                                                                    
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
                                                                    outerCircleColor="#008ffb"
                                                                    innerCircleColor="#00e396"
                                                                    middleCircleColor="#feb019"
                                                                />

                                                                { 
                                                                    !this.state.loader.suhu_tangki_modus_jam &&
                                                                    this.state.chartSuhuModusJam.statusFound &&
                                                                    <div className='w-100'>
                                                                        <ReactApexChart 
                                                                              options={this.state.chartSuhuModusJam.options} 
                                                                              series={this.state.chartSuhuModusJam.series} 
                                                                              type="area" 
                                                                              height={350} />
                                                                    </div>
                                                                }

                                                                {
                                                                    // !this.state.loader.suhu_tangki_modus_jam &&
                                                                    // !this.state.chartSuhuModusJam.statusFound &&

                                                                    // LOADER MENGIKUTI TINGGI MODUS TANGKI
                                                                    !this.state.loader.tinggi_isi_modus_jam &&
                                                                    !this.state.chartTinggiModusJam.statusFound &&
                                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                        <img src = {No_Found} className="nofound-class" />
                                                                        <div className='nofound-label'> No Data Found </div>
                                                                    </div>
                                                                }

                                                                
                                                            </div>
                                                        </Col>
                                                    </div>
                                                </div>

                                            </Row>
                                            {/* ... end <TINGGI MODUS JAM> */}

                                            <Row className='mt-2'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {MotionSensorRed} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Jarak Sensor ( m / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
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
                                                                <Form.Check.Input type={'checkbox'} 
                                                                    onChange={(val)=>{this.checkChartJam(val,'jarak_sensor')}}
                                                                    defaultChecked={this.state.chartSuhuModusJam.options.dataLabels.enabled}
                                                                />
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
                                                            visible={this.state.loader.jarak_sensor_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        {
                                                            !this.state.loader.jarak_sensor_jam &&
                                                            this.state.chartJarakSensorJam.statusFound &&

                                                            <div className='w-100'>
                                                                <ReactApexChart 
                                                                      options={this.state.chartJarakSensorJam.options} 
                                                                      series={this.state.chartJarakSensorJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.jarak_sensor_jam &&
                                                            !this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-2'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between'>

                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                      <div className='d-flex justify-content-start align-items-center'>
                                                          <img src = {Tank} width="30" height="30" />
                                                      </div>
                                                      <div>
                                                          <h5 className='dashtangki-title'>Tinggi Isi Tangki ( m / jam )</h5>
                                                          <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                      </div>
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
                                                                <Form.Check.Input 
                                                                    type={'checkbox'} 
                                                                    onChange={(val)=>{this.checkChartJam(val,'tinggi')}}
                                                                    defaultChecked={this.state.chartTinggiJam.options.dataLabels.enabled}
                                                                />
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
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.tinggi_isi_jam &&
                                                            this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart 
                                                                      options={this.state.chartTinggiJam.options} 
                                                                      series={this.state.chartTinggiJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.tinggi_isi_jam &&
                                                            !this.state.chartJarakSensorJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-3'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {TermSensor} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Suhu Tangki ( °C / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input 
                                                                  type={'checkbox'} 
                                                                  onChange={(val)=>{this.checkChartJam(val,'suhu_jam')}}
                                                                  defaultChecked={this.state.chartSuhuJam.options.dataLabels.enabled}
                                                            />
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
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.suhu_tangki_jam &&
                                                            this.state.chartSuhuJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart options={this.state.chartSuhuJam.options} 
                                                                      series={this.state.chartSuhuJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.suhu_tangki_jam &&
                                                            !this.state.chartSuhuJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* SUHU TANGKI ( KETINGGIAN )*/}
                                            <Row className='mt-3'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                        <div className='d-flex justify-content-start align-items-center gap-2'>
                                                            <div className='d-flex justify-content-start align-items-center'>
                                                                <img src = {Thermometer} width="30" height="30" />
                                                            </div>
                                                            <div>
                                                                <h5 className='dashtangki-title'>Suhu Tinggi Tangki ( °C / jam )</h5>
                                                                <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                            </div>
                                                        </div>


                                                        {/* FILTER TANGKI */}
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <div className='filter-subcap-css-title'>Filter : </div>
                                                            <Select options={this.mst_list_tangki} 
                                                                className="select-class"
                                                                isDisabled={this.state.chartSuhuTinggiJam.isDisabled}
                                                                // styles={this.customStyle_SuhuTinggiTangki}
                                                                // defaultValue={this.state.chartSuhuTinggiJam.suhuTinggiSelected} // set default value
                                                                // value={{"name":"tangki_1","api":"tank 1","bgColor":"bg-gradient-danger","title":"Tangki 1","value":"Tangki 1","label":"Tangki 1"}} // set default value
                                                                value={this.state.chartSuhuTinggiJam.suhuTinggiSelected} // set default value
                                                                tabSelectsValue={false} isClearable={true}
                                                                onChange={(e, {action})=>this.onChangeSelectSuhuTinggiFilter(e, action)}
                                                            />
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input 
                                                                type={'checkbox'} 
                                                                onChange={(val)=>{this.checkChartJam(val,'suhu_tinggi_jam')}}
                                                                defaultChecked={this.state.chartSuhuTinggiJam.options.dataLabels.enabled}
                                                            />
                                                            <Form.Check.Label>{`Show Data Label`}</Form.Check.Label>
                                                            {/* <Form.Control.Feedback type="valid">
                                                              You did it! 
                                                            </Form.Control.Feedback> */}
                                                        </Form.Check>
                                                    </div>
                                                </div>

                                                <Col> 
                                                    <div id="chart" className='d-flex justify-content-center mt-3'>

                                                        <ThreeCircles
                                                            height="100"
                                                            width="100"
                                                            color="#4fa94d"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={this.state.loader.suhu_tinggi_tangki_jam}
                                                            ariaLabel="three-circles-rotating"
                                                            outerCircleColor="#008ffb"
                                                            innerCircleColor="#00e396"
                                                            middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.suhu_tinggi_tangki_jam &&
                                                            this.state.chartSuhuTinggiJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart options={this.state.chartSuhuTinggiJam.options} 
                                                                      series={this.state.chartSuhuTinggiJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.suhu_tinggi_tangki_jam &&
                                                            !this.state.chartSuhuTinggiJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mt-3'>
                                                <hr></hr>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                                        <div className='d-flex justify-content-start align-items-center'>
                                                            <img src = {WeightTank} width="30" height="30" />
                                                        </div>
                                                        <div>
                                                            <h5 className='dashtangki-title'>Volume Tangki ( kg / jam )</h5>
                                                            <div className='mt--4'><span className='dashtangki-subtitle'>({this.state.waktu.tanggal})</span></div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Form.Check type={'checkbox'} inline>
                                                            <Form.Check.Input type={'checkbox'} onChange={(val)=>{this.checkChartJam(val,'volume_jam')}}/>
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
                                                              visible={this.state.loader.volume_tangki_jam}
                                                              ariaLabel="three-circles-rotating"
                                                              outerCircleColor="#008ffb"
                                                              innerCircleColor="#00e396"
                                                              middleCircleColor="#feb019"
                                                        />

                                                        { 
                                                            !this.state.loader.volume_tangki_jam &&
                                                            this.state.chartVolumeJam.statusFound &&
                                                            <div className='w-100'>
                                                                <ReactApexChart 
                                                                      options={this.state.chartVolumeJam.options} 
                                                                      series={this.state.chartVolumeJam.series} 
                                                                      type="area" 
                                                                      height={350} />
                                                            </div>
                                                        }

                                                        {
                                                            !this.state.loader.volume_tangki_jam &&
                                                            !this.state.chartVolumeJam.statusFound &&
                                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                                <img src = {No_Found} className="nofound-class" />
                                                                <div className='nofound-label'> No Data Found </div>
                                                            </div>
                                                        }

                                                        {/* <ReactApexChart options={this.state.chartVolumeJam.options} series={this.state.chartVolumeJam.series} type="area" height={350} /> */}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

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