/**
 * Created by Oleg on 2016-09-17.
 */

startFunction();

function startFunction() {

    var fs = require('fs');
    //Declare the file with an object that you want to match with a neighbourhood
    //Just change the file name and
    fs.readFile('fire.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var obj = JSON.parse(data);
        for(j = 0; j < obj.length; j++){
            console.log("Da/" +obj[j].mun_name +"/" + getNeighbourhood(obj[j].latitude, obj[j].longitude, function(nei){
                console.log(nei);

            }));


            console.log(j);
        }
    });
}

olegGo(5,15,function (num){
    console.log("NUm is " + num);

})


function olegGo(ar1,ar2,callback){

    callback(ar1+ ar2);
}


function getNeighbourhood(lon, lat , neighbourhood) {
    var point=[lon,lat];
    var fs = require('fs');
    fs.readFile('list.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var obj = JSON.parse(data);

        for(i=0;i<obj.length;i++){
            var polygon=[];

            for(x=0;x<obj[i].geometry.coordinates[0].length;x++) {
                polygon.push([]);
                polygon[polygon.length - 1].push(obj[i].geometry.coordinates[0][x][1]);
                polygon[polygon.length - 1].push(obj[i].geometry.coordinates[0][x][0]);
            }
            var inside = require('point-in-polygon');
            if(inside(point,polygon)) {
                var name = obj[i].area_name;
                name = name.substring(0,name.indexOf('('));
                console.log("insert " + lon +  " and " + lat + " and " +name);
                neighbourhood(lon + "and " + lon + " for " + name);
            }

        }
    });

}


