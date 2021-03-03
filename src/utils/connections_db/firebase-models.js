let { db } = require('../connections_db/firebase');
const admin = require('firebase-admin');


const tableName = (route) => {


    if (route.split('/').length % 2 == 0) {

        let docReference = route.split('/');

        let initialDoc = db.collection(docReference[0]);
        docReference.splice(0, 1);


        let path = docReference.join(',').replace(new RegExp(",", "g"), '/');
        return initialDoc.doc(path);
    } else {
        return db.collection(route);
    }

}

const createDocument = (route, data) => {
    return new Promise((resolve, reject) => {
        try {
            route.add(data)
                .then((res) => {
                    console.log('here')
                    data.id = res._path.segments[1]
                    resolve(data)
                })
                .catch(err => {
                    // console.log('Error add document', err);
                    reject();
                });

        } catch (e) {
            // console.log('Error add document 2', e);
            route.set(data)
                .then((res) => {
                    data.id = res._path.segments[1]
                    resolve(data)
                })
                .catch(err => {
                    console.log('Error set document', err);
                    reject();
                });;
        }

    })
}

const getDocument = (route, filters = []) => {
    return new Promise((resolve, reject) => {
        try {

            let doc_ref = route;

            if (filters.length > 0) {
                filters.map((element) => {
                    doc_ref = route.where(...element);
                });

                doc_ref.get()
                    .then((snapshot) => {
                        let results = []
                        if (snapshot.empty) {
                            console.log('No matching documents.');
                            resolve([]);
                        }
                        snapshot.forEach(doc => {
                            let data = doc.data();
                            data.id = doc.id
                            results.push(data);
                        });
                        resolve(results);
                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                        reject()
                    });

            } else {
                route.get()
                    .then((res) => {
                        console.log(res);
                        if (res.data()) {
                            let dataResponse = res.data()
                            dataResponse.id = res.id;
                            resolve(dataResponse);
                        } else {
                            resolve({});
                        }
                    })
                    .catch(err => {
                        reject();
                        console.log('Error getting document', err);
                    });
            }
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}

const putDocument = (route, pk_value, data) => {

    return new Promise((resolve, reject) => {
        try {
            if (pk_value) {
                route.doc(pk_value.toString()).update(data)
                    .then((res) => {
                        data.id = pk_value
                        resolve(data);
                    })
                    .catch(err => {
                        reject();
                        console.log('Error update document', err);
                    });
            } else {
                reject();
            }
        } catch (e) {
            reject();
        }
    })

}

const deleteDocument = (route, pk_value) => {

    return new Promise((resolve, reject) => {
        try {
            if (pk_value) {
                route.doc(pk_value.toString()).delete()
                    .then(() => resolve(true))
                    .catch(() => reject());
            } else {
                reject();
            }
        } catch (e) {
            reject();
        }
    })
}

const getAllDocuments = (route, filters = [], orderBy = [], limit = 0, search = []) => {

    return new Promise((resolve, reject) => {

        let doc_ref = route;
        if (filters.length > 0) {
            filters.map((element) => {
                doc_ref = doc_ref.where(...element);
            });
        }
        if (orderBy.length > 0) {
            console.log("orderedBy")
            doc_ref = doc_ref.orderBy(...orderBy);
        }
        if (limit) {
            console.log("limit")
            doc_ref = doc_ref.limit(limit);
        }
        if (search.length > 0 && filters.length <= 0) {
            search.map((se) => {
                doc_ref = doc_ref.where(...se);
            })
        }
        doc_ref.get()
            .then((res) => {
                let allDocuments = []
                res.docs.map((doc) => {
                    let data = doc.data();
                    console.log(doc.id)
                    data.id = doc.id;
                    allDocuments.push(data);
                });
                resolve(allDocuments);
            })
    })

}

const getDocumentsById = (route, ids = []) => {
    return new Promise((resolve, reject) => {
        let doc_ref = route;
        doc_ref = doc_ref.where(admin.firestore.FieldPath.documentId(), "in", ids)
        doc_ref.get()
            .then((res) => {
                let allDocuments = []
                res.docs.map((doc) => {
                    let data = doc.data();
                    data.id = doc.id;
                    allDocuments.push(data);
                });
                resolve(allDocuments);
            })
    })
}

module.exports = {
    createDocument,
    tableName,
    getDocument,
    putDocument,
    deleteDocument,
    getAllDocuments,
    getDocumentsById
}