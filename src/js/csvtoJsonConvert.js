// This file converts .CSV file to Jason format.
// Loads all the data from image_tags.csv file from the csv folder.
let ImageTag1 = require('dsv-loader!../csvfiles/ImageTag.csv');
// Imports lodash library for the utility function. 
import _ from "lodash";
/* Below function finds the values from csv file. If the value found 0 then programe will temporary delete that cell from csv file.
If the cell vaule is 1 then the program will print all the related data to that keyword. */
let csvtoJsonFileCon=()=>{
    _.forEach(ImageTag1, function(Obj){
        let KeyValue=_.keysIn(Obj);
        _.forEach(KeyValue, function(value){
            if(Obj[value]=== "0"){
                delete Obj[value];
            }
        });
        Obj.appended=false;
    });
    return ImageTag1;
}
export default csvtoJsonFileCon();