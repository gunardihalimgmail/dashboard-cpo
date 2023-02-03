import { errorMonitor } from "stream";

export const formatDate = (tanggal:any, format: 
                                "HH:mm"|"DD MMMM YYYY"|
                                "DD MMMM YYYY HH:mm:ss"|
                                "DD MMM YYYY HH:mm:ss" |
                                "YYYY-MM-DD" |
                                "YYYY-MM-DD HH:mm" |
                                "YYYY-MM-DDTHH:mm:ssZ" |
                                "YYYY-MM-DDTHH:mm:ss" |
                                "YYYY-MM-DD HH:mm:ss") => {
    let final_format:any = '';
    if (!isNaN(tanggal)){
        let month_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        let tanggal_d:any = ("0" + tanggal.getDate()).slice(-2);
        let month_m:any = ("0" + (tanggal.getMonth()+1)).slice(-2);
        let date_d:any = ("0" + tanggal.getDate()).slice(-2);
        let month_idx:any = tanggal.getMonth();
        let year_y:any = tanggal.getFullYear();
        let hour_d:any = ("0" + tanggal.getHours()).slice(-2);
        let minutes_d:any = ("0" + tanggal.getMinutes()).slice(-2);
        let seconds_d:any = ("0" + tanggal.getSeconds()).slice(-2);

        switch(format){
            case 'HH:mm':
                final_format = hour_d + ":" + minutes_d;
                break;
            case 'DD MMMM YYYY':
                final_format = tanggal_d + " " + month_arr[month_idx] + " " + year_y;
                break;
            case 'DD MMMM YYYY HH:mm:ss':
                final_format = tanggal_d + " " + month_arr[month_idx] + " " + year_y
                               + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'DD MMM YYYY HH:mm:ss':
                final_format = tanggal_d + " " + month_m + " " + year_y
                               + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'YYYY-MM-DDTHH:mm:ssZ':
                final_format = year_y + "-" + month_m + "-" + date_d + "T" + hour_d + ":" + minutes_d + ":" + seconds_d + "Z";
                break;
            case 'YYYY-MM-DDTHH:mm:ss':
                final_format = year_y + "-" + month_m + "-" + date_d + "T" + hour_d + ":" + minutes_d + ":" + seconds_d + "+0000";
                break;
            case 'YYYY-MM-DD HH:mm:ss':
                final_format = year_y + "-" + month_m + "-" + date_d + " " + hour_d + ":" + minutes_d + ":" + seconds_d;
                break;
            case 'YYYY-MM-DD HH:mm':
                final_format = year_y + "-" + month_m + "-" + date_d + " " + hour_d + ":" + minutes_d;
                break;
            case 'YYYY-MM-DD':
                final_format = year_y + "-" + month_m + "-" + date_d;
                break;
        }

    }
    return final_format
}

export const postApi = async (url?:any, param?:any, isAwait?:boolean, token_code?:any, body?:any, callback?:any) =>
{
  let obj_token_key:any = {
    "1":'$2a$04$1t8/RrKuG1aCdc820GzGWOptHHy67BPS9jjHfWQpdHKyIzkuNmPRW', // akun bestagro
    "2":"811aea285d3c31db515c56520ae369aded18a623"
  }

  let token_final:any = obj_token_key?.[token_code];
  
  const requestOptions = {
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(
        {
          ...body,
          // token_key: '811aea285d3c31db515c56520ae369aded18a623'
          // token_key:'$2a$04$1t8/RrKuG1aCdc820GzGWOptHHy67BPS9jjHfWQpdHKyIzkuNmPRW'
          token_key: token_final
        }
    )
  };

  
  if (!isAwait)
  {
    fetch(url,requestOptions)
      .then(response => response.json())
      .then(data => callback(data))
    }
  else
  {
    // alert(isAwait)
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    // console.log(result)
    callback(result)
    // await fetch(url,requestOptions)
    //   .then(response => response.json())
    //   .then(data =>  console.log(data))
    //   .catch(err => alert(err))
  }
  return
}