

const addAddress = async(req,res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Error'
        })
    }
}

const fetchAllAddress = async(req,res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Error'
        })
    }
}

const editAddress = async(req,res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Error'
        })
    }
}

const deleteAddress = async(req,res)=>{
    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Error'
        })
    }
}



module.exports = {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress
}