  $(document).on('click','#btnUploadFile',function(){
    
    if ($("#fileToUpload").get(0).files.length == 0) { // alerts if no file is selected
      alert("Please upload the file first.");
      return;
    }

    let fileUpload = $("#fileToUpload").get(0);
    let files = fileUpload.files;
    if (files[0].name.toLowerCase().lastIndexOf(".csv") == -1) { //alerts if the wrong file type
      alert("Please upload only CSV files");
      return;
    }

    let reader = new FileReader();
    let bytes = 50000;
    reader.onloadend = function (evt) {
      let lines = evt.target.result;
      if (lines && lines.length > 0) {
        let line_array = CSVToArray(lines);
        displayData(line_array);            // reads file contents and passes array to displayData function.
        if (lines.length == bytes) {
          line_array = line_array.splice(0, line_array.length - 1);
        }
      }
    }
    let blob = files[0].slice(0, bytes);
    reader.readAsBinaryString(blob);
});

function displayData(arr){
    arr.shift();
    let basket = arr.map((item) => {
        if(item != ''){
            return {
                "fruit": item[0].trim(),
                "days": item[1],
                "charA": item[2].trim(),
                "charB": item[3].trim()
            }
        }
    })
    for(let i = 0; i < basket.length; i++){
        if(basket[i] == '' || basket[i] == undefined || basket[i] == null) basket.splice(i, 1);
    }
    let fruitTotal = basket.length;
    let totalType = 0;
    let types = [];
    let characteristics = [];
    basket.forEach((item) => {
        
        // Adds fruit type to array, or increments value if already in array
        let check = types.some(function(obj) { // checks to see if item already exist in type array
            return obj.type === item.fruit;
        });
        if(check == false){
            if(item.days > 3) types.push({type: item.fruit, num: 1, over3: 1});
            else types.push({type: item.fruit, num: 1, over3: 0});
        } else{
            let index = types.findIndex(x => x.type == item.fruit);
            types[index].num++;
            if(item.days > 3) types[index].over3++;
        }

        // Adds fruit characteristic to array, or increments value if already in array
        let check1 = characteristics.some(function(obj) { // checks to see if item already exist in type array
            return obj.type === item.fruit && ((obj.charA === item.charA && obj.charB === item.charB) || (obj.charA === item.charB && obj.charB === item.charA));
        });
        if(check1 == false){
            characteristics.push({type: item.fruit, charA: item.charA, charB: item.charB, num: 1});
        } else{
            let index = characteristics.findIndex(x => x.type == item.fruit && ((x.charA == item.charA && x.charB == item.charB) || (x.charA == item.charB && x.charB == item.charA)));
            characteristics[index].num++;
        }
    })
    totalType = types.length;
    
    $('#total').text(fruitTotal);
    $('#types').text(totalType);
    
    types.sort((a,b) => (a.num < b.num) ? 1 : ((b.num < a.num) ? -1 : 0));
    types.forEach((item) => {
        $('#tb1 tr:last').after('<tr><td>'+item.type+'</td><td>'+item.num+'</td><td>'+item.over3+'</td></tr>');
    })

    characteristics.sort((a,b) => (a.num < b.num) ? 1 : ((b.num < a.num) ? -1 : 0));
    characteristics.forEach((item) => {
        $('#tb2 tr:last').after('<tr><td>'+item.num+'</td><td>'+item.type+'</td><td>'+item.charA+'</td><td>'+item.charB+'</td></tr>');
    })

    $('.show').css({'display':'flex'});
    $('#container').css({'display':'none'});
}


  function CSVToArray(strData, strDelimiter) { // function that converts the csv file to an array
    strDelimiter = (strDelimiter || ",");
    let objPattern = new RegExp(
      (
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
      "gi"
      );
    let arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
      let strMatchedDelimiter = arrMatches[1];
      let strMatchedValue = [];
      if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
        arrData.push([]);
      }
      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"),"\"");
      } else {
        strMatchedValue = arrMatches[3];
      }
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return (arrData);
  }

