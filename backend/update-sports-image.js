const mongoose = require('mongoose');
const HomeSettings = require('./src/models/HomeSettings');

mongoose.connect('mongodb+srv://bhargavtech40_db_user:ZoHONBMti9pwROCi@clustervems.5bwrdfe.mongodb.net/vivekananda').then(async () => {
  const settings = await HomeSettings.findOne();
  if (settings && settings.facilities) {
    const sportsFacility = settings.facilities.find(f => f.title === 'Sports Complex');
    if (sportsFacility) {
      sportsFacility.imageUrl = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80';
      await settings.save();
      console.log('Successfully updated sports complex image in DB');
    }
  }
  mongoose.connection.close();
}).catch(console.error);
