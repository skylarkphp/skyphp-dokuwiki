define([
    "skylark-langx/langx",
    "skylark-domx-eventer",
    "./images",
    "./is-completed",
    "./is-loaded"
], function(langx,eventer,images,isCompleted,isLoaded) {

  function watch(imgs) {
    if (!langx.isArray(imgs)) {
      imgs = [imgs];
    }
    var totalCount = imgs.length,
        progressedCount = 0,
        successedCount = 0,
        faileredCount = 0,
        d = new langx.Deferred();


    function complete() {

      d.resolve({
        "total" : totalCount,
        "successed" : successedCount,
        "failered" : faileredCount,
        "imgs" : imgs 
      });
    }

    function progress(img,isLoaded) {

      progressedCount++;
      if (isLoaded) {
        successedCount ++ ; 
      } else {
        faileredCount ++ ;
      }

      // progress event
      d.progress({
        "img" : img,
        "isLoaded" : isLoaded,
        "progressed" : progressedCount,
        "total" : totalCount,
        "imgs" : imgs 
      });

      // check if completed
      if ( progressedCount == totalCount ) {
        complete();
      }
    }

    function check() {
      if (!imgs.length ) {
        complete();
        return;
      }

      imgs.forEach(function(img) {
        if (isCompleted(img)) {
          progress(img,isLoaded(img));
        } else {
          eventer.on(img,{
            "load" : function() {
              progress(img,true);
            },

            "error" : function() {
              progress(img,false);
            }
          });      
        }
      });
    }

    langx.defer(check);

    d.promise.totalCount = totalCount;
    return d.promise;
  }



  return images.watch = watch;
});
