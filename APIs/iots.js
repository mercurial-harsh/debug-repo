const { db } = require('../util/admin');

exports.getAlliots = (request, response) => {
	db
        .collection('iots')
        .where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let iots = [];
			data.forEach((doc) => {
				iots.push({
                    iotId: doc.id,
                    title: doc.data().title,
                    username: doc.data().username,
					body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    status: doc.data().status
				});
			});
			return response.json(iots);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getOneiot = (request, response) => {
	db
        .doc(`/iots/${request.params.iotId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json(
                    { 
                        error: 'iot not found' 
                    });
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
			iotData = doc.data();
			iotData.iotId = doc.id;
			return response.json(iotData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};

exports.postOneiot = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newiotItem = {
        title: request.body.title,
        username: request.user.username,
        body: request.body.body,
        createdAt: new Date().toISOString(),
        status:"active"
    }

    db
        .collection('iots')
        .add(newiotItem)
        .then((doc)=>{
            const responseiotItem = newiotItem;
            responseiotItem.id = doc.id;
            return response.json(responseiotItem);
        })
        .catch((error) => {
            console.error(error);
			response.status(500).json({ error: 'Something went wrong' });
		});
};

exports.deleteiot = (request, response) => {
    const document = db.doc(`/iots/${request.params.iotId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ 
                    error: 'iot not found' 
            })}
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ 
                error: err.code 
            });
        });
};

exports.editiot = ( request, response ) => { 
    if(request.body.iotId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('iots').doc(`${request.params.iotId}`);
    document.update(request.body)
    .then((doc)=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((error) => {
        if(error.code === 5){
            response.status(404).json({message: 'Not Found'});
        }
        console.error(error);
        return response.status(500).json({ 
                error: error.code 
        });
    });
};