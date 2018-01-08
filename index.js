"use strict";
/* global __dirname */

var express = require('express');
var bodyParser = require("body-parser");
var helmet = require("helmet");
var MongoClient = require("mongodb").MongoClient;
var path = require('path');
var cors = require("cors");
var randToken = require("rand-token");

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var mdbURL = "mongodb://admin:1234@ds251435.mlab.com:51435/si1718-phlm-contracts";

var app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

var db;

MongoClient.connect(mdbURL, { native_parser: true }, (err, database) => {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("newContracts");
    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
});

// GET data
app.get(BASE_API_PATH + "/contracts/data", function(request, response) {
    var data = [];
    var generator = randToken.generator({ chars: "numeric" });

    for (var i = 0; i < 100; i++) {
        var number = generator.generate(1);
        data.push(new Number(number));

    }
    response.send(data);
});

// GET a collection
app.get(BASE_API_PATH + "/contracts", function(request, response) {
    console.log("INFO: New GET request to /contracts");

    var query = {};

    if (request.query.reference)
        query["reference"] = request.query.reference;

    if (request.query.nmContract)
        query["nmContract"] = request.query.nmContract;

    if (request.query.leader)
        query["leader"] = request.query.leader;

    if (request.query.startDate)
        query["startDate"] = request.query.startDate;

    if (request.query.finishDate)
        query["finishDate"] = request.query.finishDate;

    if (request.query.funders)
        query["funders"] = request.query.funders;

    if (request.query.researchers)
        query["researchers"] = request.query.researchers;
        
    if (request.query.keyWords)
        query["keyWords"] = request.query.keyWords;



    db.find(query).toArray(function(err, contracts) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending contracts: " + JSON.stringify(contracts, 2, null));
            response.send(contracts);
        }
    });
});

// GET a single resource
app.get(BASE_API_PATH + "/contracts/:idContract", function(request, response) {
    var idContract = request.params.idContract;
    if (!idContract) {
        console.log("WARNING: New GET request to /Contracts/:idContract without idContract, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /Contracts/" + idContract);
        db.find({ "idContract": idContract }).toArray(function(err, filteredContracts) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("Name: " + filteredContracts.name);
                if (filteredContracts.length > 0) {
                    var contact = filteredContracts[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending contact: " + JSON.stringify(contact, 2, null));
                    response.send(contact);
                }
                else {
                    console.log("WARNING: There are not any contact with id " + idContract);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/contracts", function(request, response) {
    var newcontract = request.body;
    if (!newcontract) {
        console.log("WARNING: New POST request to /contracts/ without contract, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /contracts with body: " + JSON.stringify(newcontract, 2, null));
        if (!newcontract.nmContract || !newcontract.leader || !newcontract.reference ||
            !newcontract.startDate || !newcontract.finishDate ||
            !newcontract.funders) {
            console.log("WARNING: The contract " + JSON.stringify(newcontract, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            newcontract.idContract = newcontract.reference.toLowerCase();
            newcontract.idContract = newcontract.idContract.replace("/", "-");
            db.find({ "idContract": newcontract.idContract }).toArray(function(err, contracts) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var contractsBeforeInsertion = contracts.filter((contract) => {
                        return (contract.idContract.localeCompare(newcontract.idContract, "en", { 'sensitivity': 'base' }) === 0);
                    });
                    if (contractsBeforeInsertion.length > 0) {
                        console.log("WARNING: The contract " + JSON.stringify(newcontract, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding contract " + JSON.stringify(newcontract, 2, null));
                        db.insert(newcontract);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//POST over a single resource
app.post(BASE_API_PATH + "/contracts/:idContract", function(request, response) {
    var idContract = request.params.idContract;
    console.log("WARNING: New POST request to /contracts/" + idContract + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/contracts", function(request, response) {
    console.log("WARNING: New PUT request to /contracts, sending 405...");
    response.sendStatus(405); // method not allowed
});

//PUT over a single resource
app.put(BASE_API_PATH + "/contracts/:idContract", function(request, response) {
    var updatedcontract = request.body;
    var idContract = request.params.idContract;
    if (!updatedcontract) {
        console.log("WARNING: New PUT request to /contracts/ without contract, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /contracts/" + idContract + " with data " + JSON.stringify(updatedcontract, 2, null));
        if (!updatedcontract.nmContract || !updatedcontract.leader ||
            !updatedcontract.startDate || !updatedcontract.finishDate ||
            !updatedcontract.funders) {
            console.log("WARNING: The contract " + JSON.stringify(updatedcontract, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            db.find({ "idContract": idContract }).toArray(function(err, contracts) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var contractsBeforeInsertion = contracts.filter((contract) => {
                        return (contract.idContract.localeCompare(idContract, "en", { 'sensitivity': 'base' }) === 0);
                    });
                    if (contractsBeforeInsertion.length > 0) {
                        db.update({ idContract: idContract }, updatedcontract);
                        console.log("INFO: Modifying contract with idContract " + idContract + " with data " + JSON.stringify(updatedcontract, 2, null));
                        response.send(updatedcontract); // return the updated contract
                    }
                    else {
                        console.log("WARNING: There are not any contract with idContract " + idContract);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/contracts", function(request, response) {
    console.log("INFO: New DELETE request to /contracts");
    db.remove({}, { multi: true }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved) {
                console.log("INFO: All the contracts (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no contracts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/contracts/:idContract", function(request, response) {
    var idContract = request.params.idContract;
    if (!idContract) {
        console.log("WARNING: New DELETE request to /contracts/:idContract without idContract, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /contracts/" + idContract);
        db.remove({ idContract: idContract }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: contracts removed: " + numRemoved);
                if (numRemoved) {
                    console.log("INFO: The contract with idContract " + idContract + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no contracts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
