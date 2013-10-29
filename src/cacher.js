function Cache(map) {
    this.map = map;
    
    this.__ID__ = 'cache-id-' + Math.floor(Math.random() * (new Date()).getMilliseconds());

    this.set = function(property, value) {
        if( typeof property == 'object' && !value ) {
            this.map = property;
        }
        else {
            this[property] = value;
        }
        
        this.update();

        return this;
    };
    
    this.update = function() {
        if( !this.map ) return;
        
        if(typeof this.map != 'object')
            this.map = {'value': this.map};
        
        if(typeof this.map['__ID__'] != 'undefined' && this.map['__ID__'] != this.__ID__) {
            var cache = this.map.map;
            this.map = cache;
            cache = void(0);
        }

        if(typeof this.map == 'object') {
            if(this.map.constructor && this.map.constructor.name) {
                if(window.hasOwnProperty(this.map.constructor.name) && this.map.constructor.name.toLowerCase() != 'object') {
                    this[this.map.constructor.name] = this.map;
                    return;
                }
            }
        }

        for(var prop in this.map) {
            this[prop] = this.map[prop];
        }

        return this;
    };

    this.clone = function() {
        return new Cache(this.map);
    };
    
    this.clear = function() {
        for(var prop in this) {
            for(var m in this.map) {
                if(prop == m && this[prop] == this.map[m]) {
                    delete this[prop];
                }
            }
        }
        this.map = void(0);

        return this;
    };

    this.getMap = function() {
        return this.map;
    };

    this.toString = function() {
        var printedObjects = [];
        var printedObjectKeys = [];
        var indent = 2;
        var obj = this.map;
        var div = document.createElement('div');
        
        function replacer(key, value) {
            return 'DOM | WINDOW ELEMENT';
        }

        function printOnceReplacer(key, value){
            if ( window.hasOwnProperty(key) || document.hasOwnProperty(key) || document.body.hasOwnProperty(key) || Cache.hasOwnProperty(key) || div.hasOwnProperty(key)) {
                return;
            }

            if ( printedObjects.length > 2000 ) { // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
                return 'object too long';
            }

            var printedObjIndex = false;
            printedObjects.forEach(function(obj, index){
                if( obj === value ){
                    printedObjIndex = index;
                }
            });

            if ( key == '' ) { //root element
                printedObjects.push(obj);
                printedObjectKeys.push("root");
                return value;
            }

            else if( printedObjIndex + "" != "false" && typeof(value) == "object" ) {
                if ( printedObjectKeys[printedObjIndex] == "root" ){
                    return "(pointer to root)";
                } else {
                    return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
                }
            } else {
                var qualifiedKey = key || "(empty key)";
                printedObjects.push(value);
                printedObjectKeys.push(qualifiedKey);
                return value;
            }
        }

        return JSON.stringify(obj, printOnceReplacer, indent);
    }

    this.cookie = function(name, expires) {
        var value = this.map.toString();
        var name = name;
        var expr = new Date();
        expr.setDate( new Date().getDate() + expires );
        expr = expr.toUTCString();

        return name + '=' + value + ';expires=' + expr;
    };

    this.addCookie = function(name, expires) {
        document.cookie = this.cookie(name, expires);

        return this;
    };
    
    this.update();

    return this;
};