function AtomicBoolean(value) {
this.get=function(){return value;};
this.set=function(valueIn){value=valueIn;};
}
