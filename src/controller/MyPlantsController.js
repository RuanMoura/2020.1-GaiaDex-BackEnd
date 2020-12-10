const User = require('../models/User');
const Plant = require('../models/Plant');
const MyPlant = require('../models/MyPlant');

const myPlantSchema = require('../schemas/myPlantSchema');

class MyPlantsController {
  static async fetchPlants(req, res) {
    res.send({ message: 'User Backyard.' });
  }

  static async createPlant(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const plant = await Plant.findById(req.params.plantId);

      const result = myPlantSchema.validate({ nickname: req.body.nickname });
      if (result.error) return res.status(400).send(result.error);

      const myPlant = await MyPlant.create({
        user,
        nickname: req.body.nickname,
        plant,
      });

      await user.myPlants.push(myPlant);
      await user.save();
      return res.status(200).send({ myPlant });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while adding plant to backyard.${err}` });
    }
  }

  static async searchPlant(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const index = user.myPlants.indexOf(req.params.myPlantId);

      if (index > -1) {
        const myPlant = await MyPlant.findById(req.params.myPlantId);
        return res.send({
          nickname: myPlant.nickname,
          plant: myPlant.plant,
          creation: myPlant.createdAt,
        });
      }
      return res.send({
        message: 'Backyard plant not found.',
      });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while searching for plant.${err}` });
    }
  }

  static async updatePlant(req, res) {
    try {
      const newNick = req.body;

      const result = myPlantSchema.validate(newNick);
      if (result.error) {
        return res
          .status(400)
          .send({ error: `Error while editing plant. ${result.error}` });
      }

      await MyPlant.findOneAndUpdate({ _id: req.params.myPlantId }, newNick, {
        useFindAndModify: false,
      });

      return res.send({ message: 'Backyard plant updated successfully.' });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while updating backyard plant.${err}` });
    }
  }

  static async deletePlant(req, res) {
    try {
      const myPlant = await MyPlant.findById(req.params.myPlantId);
      const user = await User.findById(myPlant.user);

      const index = user.myPlants.indexOf(req.params.myPlantId);

      if (index > -1) {
        user.myPlants.splice(index, 1);
      }

      await user.save();

      await MyPlant.findByIdAndRemove(req.params.myPlantId, {
        useFindAndModify: false,
      });

      return res.send({
        message: 'Plant successfully removed from backyard.',
      });
    } catch (err) {
      return res
        .status(400)
        .send({ error: `Error while deleting plant from backyard.${err}` });
    }
  }
}

module.exports = MyPlantsController;
