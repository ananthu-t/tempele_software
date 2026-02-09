<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Nakshatra;
use App\Models\Rashi;

class RitualMasterSeeder extends Seeder
{
    public function run(): void
    {
        $nakshatras = [
            ['name' => 'Ashwati', 'name_ml' => 'അശ്വതി'],
            ['name' => 'Bharani', 'name_ml' => 'ഭരണി'],
            ['name' => 'Kartika', 'name_ml' => 'കാർത്തിക'],
            ['name' => 'Rohini', 'name_ml' => 'രോഹിണി'],
            ['name' => 'Makayiram', 'name_ml' => 'മകയിരം'],
            ['name' => 'Thiruvathira', 'name_ml' => 'തിരുവാതിര'],
            ['name' => 'Punartham', 'name_ml' => 'പുണർതം'],
            ['name' => 'Pooyam', 'name_ml' => 'പൂയ്യം'],
            ['name' => 'Ayilyam', 'name_ml' => 'ആയില്യം'],
            ['name' => 'Makam', 'name_ml' => 'മകം'],
            ['name' => 'Pooram', 'name_ml' => 'പൂരം'],
            ['name' => 'Uthram', 'name_ml' => 'ഉത്രം'],
            ['name' => 'Atham', 'name_ml' => 'അത്തം'],
            ['name' => 'Chithira', 'name_ml' => 'ചിത്തിര'],
            ['name' => 'Chothi', 'name_ml' => 'ചോതി'],
            ['name' => 'Visakham', 'name_ml' => 'വിശാഖം'],
            ['name' => 'Anizham', 'name_ml' => 'അനിഴം'],
            ['name' => 'Thrikketta', 'name_ml' => 'തൃക്കേട്ട'],
            ['name' => 'Moolam', 'name_ml' => 'മൂലം'],
            ['name' => 'Pooradam', 'name_ml' => 'പൂരാടം'],
            ['name' => 'Uthradam', 'name_ml' => 'ഉത്രാടം'],
            ['name' => 'Thiruvonam', 'name_ml' => 'തിരുവോണം'],
            ['name' => 'Avittam', 'name_ml' => 'അവിട്ടം'],
            ['name' => 'Chathayam', 'name_ml' => 'ചതയം'],
            ['name' => 'Pooruruttathi', 'name_ml' => 'പൂരുരുട്ടാതി'],
            ['name' => 'Uthruttathi', 'name_ml' => 'ഉത്രട്ടാതി'],
            ['name' => 'Revathi', 'name_ml' => 'രേവതി'],
        ];

        foreach ($nakshatras as $nakshatra) {
            Nakshatra::updateOrCreate(['name' => $nakshatra['name']], $nakshatra);
        }

        $rashis = [
            ['name' => 'Medam', 'name_ml' => 'മേടം'],
            ['name' => 'Idavam', 'name_ml' => 'ഇടവം'],
            ['name' => 'Mithunam', 'name_ml' => 'മിഥുനം'],
            ['name' => 'Karkidakam', 'name_ml' => 'കർക്കിടകം'],
            ['name' => 'Chingam', 'name_ml' => 'ചിങ്ങം'],
            ['name' => 'Kanni', 'name_ml' => 'കന്നി'],
            ['name' => 'Thulam', 'name_ml' => 'തുലാം'],
            ['name' => 'Vrischikam', 'name_ml' => 'വൃശ്ചികം'],
            ['name' => 'Dhanu', 'name_ml' => 'ധനു'],
            ['name' => 'Makaram', 'name_ml' => 'മകരം'],
            ['name' => 'Kumbham', 'name_ml' => 'കുംഭം'],
            ['name' => 'Meenam', 'name_ml' => 'മീനം'],
        ];

        foreach ($rashis as $rashi) {
            Rashi::updateOrCreate(['name' => $rashi['name']], $rashi);
        }
    }
}
