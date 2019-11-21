try {
  require("skylark-bootstrap3");
  require("skylark-bootstrap3/loadedInit")();
} catch(e) {
    console.error("please use skylark-requirejs");
}