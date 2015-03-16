module.exports = function(req, res, next){
    function randBright(){ 
    	/*  
    		Generates random pastel colour array.
    		Should return colour like rgb(203, 255, 160).
     		There should always be 255 and 160 and one random value between 160 and 255. 
     		Order of colours should be random as well.
     	*/
    	var colourArr = [];
    	
    	function findEmptyArrField(){ //recursive function to determine random empty field;
    		var ind = Math.floor(Math.random()*3);
    		if(!colourArr[ind]){
    			return ind;
    		}
    		return findEmptyArrField();
    	};
    	
    	colourArr[findEmptyArrField()] = Math.round(Math.random()*105)+160;
    	colourArr[findEmptyArrField()] = 255;
    	colourArr[findEmptyArrField()] = 160;

    	return colourArr;
    }

    function createRgbString(colourArr){
    	return "rgb("+colourArr[0]+","+colourArr[1]+","+colourArr[2]+")";
    }

    if (!req.session.colour){
        req.session.colour = createRgbString(randBright());
    }

    if (!req.session.userName){
        req.session.userName = "sockio"+Math.round(Math.random()*10000);
        req.session.userSet = false;
    }

    next();
}