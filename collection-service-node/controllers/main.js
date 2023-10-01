const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Branch = require('../models/branch');
const bcrypt = require('bcryptjs');

//const orders = []
//var lastOrderDigit = 0;


exports.getOrders = (req, res, next) => {
    Order.find({ branchId: mongoose.Types.ObjectId(req.params.branchId) })
        .then(fetchedOrders => res.send({ orders: fetchedOrders }).status(200)).catch(err => console.log(err));
}

exports.getLastOrder = (req, res, next) => {
    console.log(req.params.branchId);
    Branch.findById(mongoose.Types.ObjectId(req.params.branchId)).then(branch => {
        console.log(branch);
        //console.log(branch.toObject().name);
        res.send({ lastOrderDigit: branch.toObject().lastOrderDigit });
    }).catch(err => console.log(err));
};


exports.postAddOrder = (req, res, next) => {
//       bcrypt.hash('test2020', 12).then(password => {    
//       const newbranch = new Branch({email: 'test@powerprint.cz', password: password, name:'test', lastOrderDigit: 0}).save().then().catch(err => console.log(err)).then(()=> console.log(newbranch)).catch(err =>console.log(err));
// // //     // console.log(newbranch);
//  })
    const alert = {};
    console.log(req.body);
    console.log(req.body.orderDigit);
    console.log(req.body.branchId);
    Order.find({ orderDigit: req.body.orderDigit, branchId: req.body.branchId})
        .then((ordersWithSameDigit) => {
            //console.log(ordersWithSameDigit);
            // CHECK WHETHER INSERTED DIGIT IS NOT ALREADY ASSIGNED TO ANOTHER ORDER
            if (ordersWithSameDigit.length === 0) {
                const currentOrder = new Order({ ...req.body, isOrderReady: false })
                    .save()
                    .then(() => {
                        Branch.findById(req.body.branchId)
                            .then(branch => {
                                console.log(branch);
                                branch.lastOrderDigit = req.body.orderDigit;
                                branch.save().then()
                            }).catch(err => console.log(err));
                    })
                    .then(() => {
                        Order.find({ branchId: mongoose.Types.ObjectId(req.body.branchId) })
                            .then(fetchedOrders => {
                                //console.log(fetchedOrders);
                                req.io.emit((req.body.branchId+'/orders'), fetchedOrders);
                                alert.content = '[' + req.body.orderDigit + ']' + ' Číslo bylo úspěšně přidáno';
                                alert.isPositive = true;
                                res.send({ response: alert }).status(201)
                            }).catch(err => {
                                console.log(err);
                                alert.content = '[' + req.body.orderDigit + ']' + 'Chyba načítání objednávek';
                                alert.isPositive = false;
                                console.log(alert);
                                res.send({ response: alert }).status(201);

                            });
                    })
                    .catch(err => {
                        console.log(err);
                        alert.content = '[' + req.body.orderDigit + ']' + 'Chyba ukládání';
                        alert.isPositive = false;
                        console.log(alert);
                        res.send({ response: alert }).status(201);
                    });
            } else {
                alert.content = '[' + req.body.orderDigit + ']' + ' Číslo je již přiřazeno k jiné objednávce';
                alert.isPositive = false;
                Order.find({ branchId: mongoose.Types.ObjectId(req.body.branchId) })
                    .then(fetchedOrders => {
                        //console.log(fetchedOrders);
                        req.io.emit((req.body.branchId+'/orders'), fetchedOrders);
                        res.send({ response: alert }).status(201);

                    }).catch(err => {
                        console.log(err);
                        alert.content = '[' + req.body.orderDigit + ']' + 'Chyba načítání objednávek';
                        alert.isPositive = false;
                        console.log(alert);
                        res.send({ response: alert }).status(201);

                    });
            }
            console.log(alert);

        }).catch(err => {
            console.log(err);
            alert.content = '[' + req.body.orderDigit + ']' + 'Chyba načítání objednávek';
            alert.isPositive = false;
            console.log(alert);
            res.send({ response: alert }).status(201);
        });


    // OLDER VERSION
    //   currentOrder.isOrderReady = false;
    //   if (currentOrder) {
    //     if (currentOrder) {
    //       try {
    //         lastOrderDigit = parseInt(currentOrder.orderDigit);
    //       } catch(err) {
    //         console.log(err);
    //         alert.content = 'Vložte číslo';
    //         alert.isPositive = false;
    //         res.send({ response: alert}).status(400);
    //       }
    //   var found = false;
    //   for (var i = 0; i < orders.length; i++) {
    //     if (orders[i].orderDigit == currentOrder.orderDigit) {
    //       found = true;
    //       break;
    //     }
    //   }

    //   if (found) {
    //     alert.content = '['+currentOrder.orderDigit+']'+' Čísla se nesmí opakovat';
    //     alert.isPositive = false;
    //   } else {
    //       // Success
    //       const newOrder = new Order({...currentOrder, branchId: mongoose.Types.ObjectId('5e64dae81c9d4400005e460f')}).catch(err => console.log(err));

    //     alert.content = '['+currentOrder.orderDigit+']'+' Číslo bylo úspěšně přidáno';
    //     alert.isPositive = true;
    //     orders.push(currentOrder);
    //   }

    //     } else {
    //       alert.content = '['+currentOrder.orderDigit+']'+' Zadejte číslo nebo generujte automaticky';
    //       alert.isPositive = false;
    //     }
    //   } else {
    //     alert.content = '['+currentOrder.orderDigit+']'+' Chyba přijetí objednávky';
    //     alert.isPositive = false;
    //   }

};

const validateOrderId = (id) => {
    // VALIDATING ORDER ID
    return new Promise((resolve, reject) => {
        console.log('Validation');
        if (mongoose.Types.ObjectId.isValid(id)) {
            resolve(id);
        } else {
            Order.findOne({ orderDigit: id }).then(order => {
                console.log(order);
                if(order) {
                    console.log(order._id);
                    resolve(order._id);
                } else {
                    reject('Objednávka nenalezena');
                }
                
            }).catch(err => {
                console.log(err)
                reject(err);
            });
        }
    })

};

exports.putUpdateOrder = (req, res, next) => {
    const alert = {};
    validateOrderId(req.params.id).then(id => {
        console.log(id);
        if (id) {
            let orderDigit = null;
            console.log(id);
            Order.findById(id)
                .then(order => {
                    order.isOrderReady = true;
                    orderDigit = order.orderDigit;
                    console.log(order);
                    order.save()

                        .then(() => Order.find({ branchId: order.branchId })
                            .then(orders => {
                                //console.log(orders);
                                alert.content = '[' + orderDigit + ']' + ' Objednávka čeká na vyzvednutí';
                                alert.isPositive = true;
                                console.log(alert);
                                req.io.emit((order.branchId+'/orders'), orders);
                                res.send({ response: alert }).status(201);

                            }).catch(err => {
                                console.log(err);
                                alert.content = '[' + orderDigit + ']' + ' Chyba načítání objednávek';
                                alert.isPositive = false;
                                console.log(alert);
                                res.send({ response: alert }).status(201);
                            })).catch(err => {
                                console.log(err);
                                alert.content = '[' + orderDigit + ']' + ' Chyba ukládání změn';
                                alert.isPositive = false;
                                console.log(alert);
                                res.send({ response: alert }).status(201);
                            })
                }).catch(err => {
                    console.log(err);
                    alert.content = '[' + orderDigit + ']' + ' Objednávka nenalezena';
                    alert.isPositive = false;
                    console.log(alert);
                    res.send({ response: alert }).status(201);
                })
        } else {
            alert.content = '[' + ']' + ' Chyba čísla objednávky/id';
            alert.isPositive = false;
            console.log(alert);
            res.send({ response: alert }).status(201);
        }
    }).catch(err => {
        console.log(err);
        alert.content = '[' + ']' + ' Chyba čísla objednávky/id';
        alert.isPositive = false;
        console.log(alert);
        res.send({ response: alert }).status(201);
    })
};


// OLDER VERSION    
//console.log(req.params.digit);
// const currentOrder = orders.find(order => order.orderDigit === parseInt(req.params.digit));
// if (currentOrder) {
//     currentOrder.isOrderReady = true;
//     alert.content = '[' + currentOrder.orderDigit + ']' + ' Objednávka čeká na vyzvednutí';
//     alert.isPositive = true;
// } else {
//     alert.content = '[' + currentOrder.orderDigit + ']' + ' Objednávna nenalezena';
//     alert.isPositive = false;
// }
// console.log(orders);
// req.io.emit('orders', orders);
// console.log(alert);
// res.send({ response: alert }).status(201);
// };

exports.deleteOrderById = (req, res, next) => {
    // DELETE ORDER
    const alert = {};
    validateOrderId(req.params.id).then(id => {
        if(id) {
        let orderDigit = null;
        Order.findByIdAndRemove(id)
            .then(order => Order.find({ branchId: order.branchId })
                .then(orders => {
                    console.log(orders);
                    req.io.emit((order.branchId+'/orders'), orders);
                    alert.content = '[' + order.orderDigit + ']' + ' Objednávka vydána';
                    alert.isPositive = true;
                    console.log(alert);
                    res.send({ response: alert }).status(201);


                }).catch(err => {
                    console.log(err);
                    alert.content = '[' + order.orderDigit + ']' + 'Chyba načítání objednávek';
                    alert.isPositive = false;
                    console.log(alert);
                    res.send({ response: alert }).status(201);
                })).catch(err => {
                    alert.content = '[' + order.orderDigit + ']' + '';
                    alert.isPositive = false;
                    console.log(alert);
                    res.send({ response: alert }).status(201);
                })
            } else {
                console.log(err);
                alert.content = '[' + ']' + ' Chyba čísla objednávky/id';
                alert.isPositive = false;
                console.log(alert);
                res.send({ response: alert }).status(201);
            }
    }).catch(err => {
        console.log(err);
        alert.content = '[' + ']' + ' Chyba čísla objednávky/id';
        alert.isPositive = false;
        console.log(alert);
        res.send({ response: alert }).status(201);
    })
};


// const fetchOrdersAndSend = (id, success, err) => {
//     Order.find({ branchId: mongoose.Types.ObjectId(id) })
//                     .then(orders => {
//                         console.log(orders);
//                         alert.content = '[' + order.orderDigit + ']' + ' Objednávka čeká na vyzvednutí';
//                         alert.isPositive = true;
//                         console.log(alert);
//                         success();

//                     }).catch(err => {
//                         console.log(err);
//                         alert.content = '[' + order.orderDigit + ']' + 'Chyba načítání objednávek';
//                         alert.isPositive = false;
//                         console.log(alert);
//                         err();
//                     })
// }





    // console.log('delete order');
    // const currentOrder = orders.find(order => order.orderDigit === parseInt(req.params.digit));
    // if (currentOrder) {
    //     orders.splice(orders.indexOf(currentOrder), 1);
    //     alert.content = '[' + currentOrder.orderDigit + ']' + ' Objednávka vydána';
    //     alert.isPositive = true;
    // } else {
    //     alert.content = +'[' + currentOrder.orderDigit + ']' + ' Objednávna nenalezena';
    //     alert.isPositive = false;
    // }
    // req.io.emit('orders', orders);
    // console.log(alert);
    // res.send({ response: alert }).status(202);

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Branch.findOne({email: (email+'@powerprint.cz')}).then(branch => {
        bcrypt.compare(password, branch.password).then(doMatch => {
            if(doMatch) {
                res.send({branch: branch}).status(201)
            }
        }).catch(err => {
            console.log(err);
            res.send({branch: null});
        })
    }).catch(err => {
        res.send({branch: null});
    });
    
}

// exports.getBranch = (req, res, next) => {
//     Branch.findOne({name: req.params.name}).then(branch => {
//         if(branch) {
//             res.send({branch: branch}).status(201);
//             console.log(branch._id);
//         } else {
//             res.send({branch: null}).status(500);
//         }
//     }).catch(err => {
//         console.log(err);
//         res.send({branch: null}).status(500);
//     })
// }

exports.getBranchById = (req, res, next) => {
    Branch.findById(req.params.id).then(branch => {
        if(branch) {
            res.send({branch: branch});
        } else {
            res.send({branch: null});
        }
    }).catch(err => {
        console.log(err);
        res.send({branch: branch});
    })
}
