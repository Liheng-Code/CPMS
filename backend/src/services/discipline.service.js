const Discipline = require('../models/discipline.model');

exports.createDiscipline = async (disciplineData) => {
  try {
    const newDiscipline = new Discipline(disciplineData);
    await newDiscipline.save();
    return newDiscipline;
  } catch (error) {
    console.error('Error in discipline service (createDiscipline):', error);
    throw new Error('Could not create discipline');
  }
};

exports.getAllDisciplines = async () => {
  try {
    const disciplines = await Discipline.find({});
    return disciplines;
  } catch (error) {
    console.error('Error in discipline service (getAllDisciplines):', error);
    throw new Error('Could not retrieve disciplines');
  }
};

exports.getDisciplineById = async (id) => {
  try {
    const discipline = await Discipline.findById(id);
    return discipline;
  } catch (error) {
    console.error('Error in discipline service (getDisciplineById):', error);
    throw new Error('Could not retrieve discipline');
  }
};

exports.updateDiscipline = async (id, updateData) => {
  try {
    const updatedDiscipline = await Discipline.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedDiscipline;
  } catch (error) {
    console.error('Error in discipline service (updateDiscipline):', error);
    throw new Error('Could not update discipline');
  }
};

exports.deleteDiscipline = async (id) => {
  try {
    const deletedDiscipline = await Discipline.findByIdAndDelete(id);
    return deletedDiscipline;
  } catch (error) {
    console.error('Error in discipline service (deleteDiscipline):', error);
    throw new Error('Could not delete discipline');
  }
};
