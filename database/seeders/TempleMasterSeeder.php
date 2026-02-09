<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TempleMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default Temple
        \App\Models\TempleDetail::create([
            'name' => 'Sri Mahadeva Temple',
            'name_ml' => 'ശ്രീ മഹാദേവ ക്ഷേത്രം',
            'address' => 'Sample Address, Kerala, India',
            'address_ml' => 'സാമ്പിൾ വിലാസം, കേരളം, ഇന്ത്യ',
            'phone' => '0471-123456',
            'email' => 'contact@temple.com',
        ]);

        // Default Deities
        $mahadeva = \App\Models\Deity::create([
            'name' => 'Lord Shiva',
            'name_ml' => 'ശിവൻ',
            'description' => 'Main Deity',
        ]);

        \App\Models\Deity::create([
            'name' => 'Lord Ganesha',
            'name_ml' => 'ഗണപതി',
            'description' => 'Sub Deity',
        ]);

        // Sample Vazhipadu
        \App\Models\Vazhipadu::create([
            'name' => 'Pushpanjali',
            'name_ml' => 'പുഷ്പാഞ്ജലി',
            'rate' => 20.00,
            'duration' => '10 mins',
        ]);

        \App\Models\Vazhipadu::create([
            'name' => 'Neyvilakku',
            'name_ml' => 'നെയ്വിളക്ക്',
            'rate' => 50.00,
            'duration' => 'Daily',
        ]);
    }
}
