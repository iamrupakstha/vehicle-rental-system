import Vehicle from "../models/Vehicle.js";


// create vehicles
export const createVehicle = async (req, res) => {
  try{
    const vehicle = await Vehicle.create({
      ...req.body,
      image: req.file ? req.file.path : ""
  });

    res.status(2001).json({
      message: 'Vehicle added successfully!'
    });
  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

//filter + search
export const getVehicles = async (req, res) => {
  try{
    const {type, search} = req.query;
    let query;
    //filter by type
    if(type) {
      query.type = type;
    }

    //search by name or brand
    if(search) {
      query.$or = [
        {name: { $regex: search, $options: 'i'}},
        {brand: { $regex: search, $options: 'i'}}
      ];
    }

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);

  } catch(error) {
    res.status(500).json({message: error.message})
  }
};

// Update vehicles
export const updateVehicle = async (req, res) => {
  try{
    const vehicle = await Vehicle.findById(req.params.id);

    if(!vehicle) {
      return res.status(404).json({message: 'Vehicle not found'});
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    );

    res.json({
      message: "Vehicle Updated!",
      vehicle: updatedVehicle
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

// delete vehicle

export const deleteVehicle = async (req, res) => {
  try{
    const vehicle = await Vehicle.findById(req.params.id);

    if(!vehicle) {
      return res.status(404).json({message: 'Vehicle not found'});
    }

    await vehicle.deleteOne();

    res.json({
      message: "Vehicle deleted successfully!"
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

