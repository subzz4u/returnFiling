angular.module('WebService', [])
    .factory('API', function($http, $resource, EnvService) {
        return {
          getRole: {
            "url": "/role/",
            "method": "GET",
            // "isArray" : true
          },
          postRole: {
            url: "/role",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          updateRole: {
            url: "/role/",
            method: "PUT",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          deleteRole: {
            url: "/role/:_id",
            method: "DELETE",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          userLogin : {
            url : "/user/login",
            method : "POST"
          },
          getUser : {
            url:"/user/",
            method: "GET"
          },
          postUser: {
            url: "/user/",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          deleteUser: {
              url: "/user/:_id",
              method: "DELETE",
              "headers": {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
          },
          updateUser: {
              url: "/user/",
              method: "PUT",
              "headers": {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
          },
          postClient: {
            url: "/client",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          postCaFirm: {
            url: "/caFirm",
            method: "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
          },
          getCaFirm : {
            url:"/caFirm/",
            method: "GET"
          },
        }
    })
    .factory('ApiGenerator', function($http, $resource, API, EnvService) {
        return {
          getApi: function(api) {
            var obj = {};
            obj = angular.copy(API[api]);
            // console.log("obj  ",obj,api);
            obj.url = EnvService.getBasePath() + obj.url; // prefix the base path
            return obj;
          }
        }
    })
    .factory('ApiCall', function($http, $resource, API, EnvService,ApiGenerator) {
      return $resource('/',null, {
        getRole: ApiGenerator.getApi('getRole'),
       // postRole: ApiGenerator.getApi('postRole'),
       // deleteRole: ApiGenerator.getApi('deleteRole'),
        //updateRole: ApiGenerator.getApi('updateRole'),
        userLogin : ApiGenerator.getApi('userLogin'),
        // getUser: ApiGenerator.getApi('getUser'),
         postUser: ApiGenerator.getApi('postUser'),
        // deleteUser: ApiGenerator.getApi('deleteUser'),
        // updateUser: ApiGenerator.getApi('updateUser'),
        // postCaFirm: ApiGenerator.getApi('postCaFirm'),
        // getCaFirm: ApiGenerator.getApi('getCaFirm'),
      })
    })
    .factory('EnvService',function($http,$localStorage){
      var envData = env = {};
      var settings =  {};

      return{
        setSettings : function(setting) {
          settings = setting;
          // setting env
          this.setEnvData(setting.envData);
        },
        getSettings : function(param) {
          if(param){
            return settings[param];
          }
          return null; // default
        },
        setEnvData: function (data) {
          envData = data[data.env];
        },
        getEnvData: function () {
          return envData;
        },
        getBasePath: function (env) {
          return this.getEnvData()['basePath']
        }

      }
    })


;
