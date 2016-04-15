'use strict';

var async = require('async');
var fragments = [];

function processProps(serviceName, serviceProperties, cb) {

  var ymlFragment = '';
  if (!serviceName) {
    var error = new Error('missing servicename..');
    return cb(error);
  }
  if (!serviceProperties) {
    var error = new Error('missing properties..');
    return cb(error);
  }

  ymlFragment = ymlFragment.concat(serviceName).concat(':').concat('\n') ;

  for (var prop of Object.getOwnPropertyNames(serviceProperties)) {

    //ports
    if ("ports" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('ports:\n') ;

      for (var portNum of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat('        - "').concat(portNum).concat('"\n') ;
      }
    }

    //image
    if ("image" === prop) {
      ymlFragment = ymlFragment.concat("    image: ").concat(serviceProperties[prop]).concat('\n') ;
    }

    //environment
    if ("environment" === prop) {
      var environmentJSON = serviceProperties[prop];
      if (Object.getOwnPropertyNames(environmentJSON).length) {

        ymlFragment = ymlFragment.concat("    environment:").concat('\n');

        for (var envJSONKey of Object.getOwnPropertyNames(environmentJSON)) {
          var environmentValue = environmentJSON[envJSONKey];
          ymlFragment = ymlFragment.concat("        - ").concat(envJSONKey).concat("=").concat(environmentValue).concat('\n') ;
        }
      }
    }

    //extra_hosts
    if ("extra_hosts" === prop) {
      var hostsJSON = serviceProperties[prop];
      if (Object.getOwnPropertyNames(hostsJSON).length) {

        ymlFragment = ymlFragment.concat("    extra_hosts:").concat('\n');

        for (var envJSONKey of Object.getOwnPropertyNames(hostsJSON)) {
          var hostsValue = hostsJSON[envJSONKey];
          ymlFragment = ymlFragment.concat("        - ").concat(envJSONKey).concat(":").concat(hostsValue).concat('\n') ;
        }
      }
    }
    //expose
    if ("expose" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('expose:\n') ;

      for (var exposePort of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat("        - ").concat(exposePort).concat('\n') ;
      }
    }

    //command
    if ("command" === prop) {
      ymlFragment = ymlFragment.concat("    command: ").concat(serviceProperties[prop]).concat('\n') ;
    }

    //dns
    if ("dns" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('dns:\n') ;

      for (var dnsServerIP of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat("        - ").concat(dnsServerIP).concat('\n') ;
      }
    }

    //dns search
    if ("dns_search" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('dns_search:\n') ;

      for (var dnsServerIP of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat("        - ").concat(dnsServerIP).concat('\n') ;
      }
    }

    //memory limit
    if ("mem_limit" === prop) {
      ymlFragment = ymlFragment.concat("    mem_limit: ").concat(serviceProperties[prop]).concat('\n') ;
    }

    //memory swap limit
    if ("memswap_limit" === prop) {
      ymlFragment = ymlFragment.concat("    memswap_limit: ").concat(serviceProperties[prop]).concat('\n') ;
    }

    //cpu_shares
    if ("cpu_shares" === prop) {
      ymlFragment = ymlFragment.concat("    cpu_shares: ").concat(serviceProperties[prop]).concat('\n') ;
    }

    //restart
    if ("restart" === prop) {
      ymlFragment = ymlFragment.concat("    restart: ").concat(serviceProperties[prop]).concat('\n') ;
    }
    
    //volumes
    if ("volumes" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('volumes:\n') ;

      for (var volume of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat("        - ").concat(volume).concat('\n') ;
      }
    }
    
    //links
    if ("links" === prop && serviceProperties[prop].length) {
      ymlFragment = ymlFragment.concat("    ").concat('links:\n') ;

      for (var link of serviceProperties[prop]) {
        ymlFragment = ymlFragment.concat("        - ").concat(link).concat('\n') ;
      }
    }
    
    //net
    if ("net" === prop) {
      ymlFragment = ymlFragment.concat("    net: ").concat(serviceProperties[prop]).concat('\n') ;
    }
    
    //entrypoint
    if ("entrypoint" === prop) {
      ymlFragment = ymlFragment.concat("    entrypoint: ").concat(serviceProperties[prop]).concat('\n') ;
    }



  }
  fragments.push(ymlFragment) ;
  cb(null, ymlFragment) ;
}

module.exports.generate = function(json, callback) {

  fragments = [] ;

  //input validations

  if (!json) {
    return callback(new Error('json is missing'));
  }
  var parsedJSON = '';
  try {
    parsedJSON = JSON.parse(json) ;
  } catch (err) {
    return callback(err);
  }

  //json processing

  async.forEachOf(parsedJSON, function(value, key, callback) {
    processProps(key, value, callback);
  }) ;var resultString = '';
  for (var fragment of fragments) {
    resultString = resultString.concat(fragment).concat('\n') ;
  }
  return callback(null, resultString);
}
