import type { TechnicalService } from './types';


export interface BusinessConfig {
  name: string;
  tagline: string;
  owner: string;
  contacts: string[];
  email: string;
  website: string;
  reviewLink: string;
  serviceAreas: string[];
  logoUrl: string;
  profileUrl: string;
}

export const businessConfig: BusinessConfig = {
  name: 'KS Electrical And AC Services',
  tagline: 'Powering Your Home, Safely',
  owner: 'Kaushindra Singh',
  contacts: ['7895321472', '9625724903'],
  email: 'kselectrical004@gmail.com',
  website: 'www.kselectrical.in',
  reviewLink: 'https://reviewthis.biz/b4d5f51f',
  serviceAreas: ['Gaur City 1', 'Gaur City 2', 'Noida Extension', 'Ghaziabad'],
  logoUrl: '/log.png',
  profileUrl: '/profile.webp'
};

export const servicesData: TechnicalService[] = [
  {
    "id": "ac-repair",
    "name": "AC Repair & Diagnostics",
    "code": "AC-REP",
    "category": "AC Services",
    "subcategory": "Repair",
    "description": "Expert diagnostics for AC cooling failure, compressor fault, capacitor replacement, PCB check, and cooling performance test.",
    "iconName": "Wind",
    "duration": "45 mins",
    "rating": "4.8 ★ (1.2k reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/ac-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Cooling Guarantee",
        "value": "30 Days"
      },
      {
        "label": "Technician Skill",
        "value": "Certified Expert"
      },
      {
        "label": "Diagnosis Tool",
        "value": "Digital multimeter"
      }
    ]
  },
  {
    "id": "ac-installation",
    "name": "AC Installation (Split)",
    "code": "AC-INST",
    "category": "AC Services",
    "subcategory": "Installation",
    "description": "Wall-mounting split AC indoor & outdoor units, bracket setup, copper piping insulation, drain ducting, and gas level check.",
    "iconName": "Settings",
    "duration": "1–2 hours",
    "rating": "4.9 ★ (840 reviews)",
    "price": 1099,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/ac-installation-noida-extension.webp",
    "specifications": [
      {
        "label": "Gas Top-up Check",
        "value": "Included"
      },
      {
        "label": "Bracket Material",
        "value": "Galvanized steel"
      },
      {
        "label": "Pipe Insulation",
        "value": "Included"
      }
    ]
  },
  {
    "id": "ac-uninstallation",
    "name": "AC Uninstallation",
    "code": "AC-UNINST",
    "category": "AC Services",
    "subcategory": "Uninstallation",
    "description": "Safe removal of split AC indoor and outdoor units, gas recovery, pipe capping, and dismounting of wall brackets.",
    "iconName": "Wind",
    "duration": "1 hour",
    "rating": "4.8 ★ (520 reviews)",
    "price": 699,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_ac_uninstall.webp",
    "specifications": [
      {
        "label": "Gas Recovery",
        "value": "Safe vacuum process"
      },
      {
        "label": "Bracket Removal",
        "value": "Wall patch included"
      },
      {
        "label": "Pipe Capping",
        "value": "Included"
      }
    ]
  },
  {
    "id": "ac-wet-clean",
    "name": "AC Jet Wash & Service",
    "code": "AC-WET",
    "category": "AC Services",
    "subcategory": "Service",
    "description": "Deep high-pressure water jet wash of AC coils, blower drum, filter mats, and outdoor cooling fins for maximum cooling.",
    "iconName": "Droplets",
    "duration": "40 mins",
    "rating": "4.9 ★ (2.1k reviews)",
    "price": 399,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/ac-service-gaur-city.webp",
    "specifications": [
      {
        "label": "Jet Pressure",
        "value": "120 Bar"
      },
      {
        "label": "Sanitizer Spray",
        "value": "Eco-friendly"
      },
      {
        "label": "Airflow Boost",
        "value": "Up to +35%"
      }
    ]
  },
  {
    "id": "ac-gas-refill",
    "name": "AC Gas Refill (R32/R22)",
    "code": "AC-GAS",
    "category": "AC Services",
    "subcategory": "Service",
    "description": "Leak detection with halogen sensor, gas refilling with R32 or R22 refrigerant, pressure balancing, and cooling test.",
    "iconName": "Droplets",
    "duration": "1–1.5 hours",
    "rating": "4.9 ★ (980 reviews)",
    "price": 1499,
    "warranty": "60 Days Warranty",
    "imageUrl": "/images/services/svc_ac_gas_refill.webp",
    "specifications": [
      {
        "label": "Gas Type",
        "value": "R32 / R22 / R410A"
      },
      {
        "label": "Leak Detection",
        "value": "Halogen sensor test"
      },
      {
        "label": "Pressure Check",
        "value": "Manifold gauge"
      }
    ]
  },
  {
    "id": "fan-basic-install",
    "name": "Basic Fan Installation",
    "code": "FAN-B-INST",
    "category": "Fan Services",
    "subcategory": "Basic Fan",
    "description": "Installing standard ceiling fan or exhaust fan, wiring connection, regulator fitting, and running balance check.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.9 ★ (1.4k reviews)",
    "price": 99,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/ceiling-fan-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Fan Type",
        "value": "Standard ceiling / exhaust"
      },
      {
        "label": "Regulator Wiring",
        "value": "Included"
      },
      {
        "label": "Balance Check",
        "value": "Wobble-free verified"
      }
    ]
  },
  {
    "id": "fan-basic-uninstall",
    "name": "Basic Fan Uninstallation",
    "code": "FAN-B-UNINST",
    "category": "Fan Services",
    "subcategory": "Basic Fan",
    "description": "Safe removal of ceiling or exhaust fan, wire capping, and canopy fitting to cover the outlet.",
    "iconName": "Zap",
    "duration": "20 mins",
    "rating": "4.8 ★ (610 reviews)",
    "price": 99,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_fan_basic_uninstall.webp",
    "specifications": [
      {
        "label": "Wire Capping",
        "value": "Included"
      },
      {
        "label": "Canopy Closure",
        "value": "Included"
      },
      {
        "label": "Ceiling Damage",
        "value": "Minimal, patch-ready"
      }
    ]
  },
  {
    "id": "fan-basic-repair",
    "name": "Basic Fan Repair",
    "code": "FAN-B-REP",
    "category": "Fan Services",
    "subcategory": "Basic Fan",
    "description": "Diagnosing ceiling or exhaust fan speed issues, capacitor replacement, motor winding check, and noise elimination.",
    "iconName": "Zap",
    "duration": "40 mins",
    "rating": "4.9 ★ (1.1k reviews)",
    "price": 149,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_fan_basic_repair.webp",
    "specifications": [
      {
        "label": "Capacitor Spec",
        "value": "2.5 mfd heavy-duty"
      },
      {
        "label": "Motor Winding",
        "value": "Copper-wire checked"
      },
      {
        "label": "Noise Standard",
        "value": "< 45 dB silent run"
      }
    ]
  },
  {
    "id": "fan-bldc-install",
    "name": "BLDC Fan Installation",
    "code": "FAN-BLDC-INST",
    "category": "Fan Services",
    "subcategory": "BLDC Fan",
    "description": "Installing energy-saving BLDC smart fan with remote receiver wiring, remote pairing, and speed setting configuration.",
    "iconName": "Zap",
    "duration": "40 mins",
    "rating": "4.9 ★ (780 reviews)",
    "price": 249,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/bldc-fan-service-gaur-city.webp",
    "specifications": [
      {
        "label": "Fan Type",
        "value": "BLDC Brushless motor"
      },
      {
        "label": "Remote Pairing",
        "value": "Included"
      },
      {
        "label": "Energy Saving",
        "value": "Up to 65% vs normal"
      }
    ]
  },
  {
    "id": "fan-bldc-uninstall",
    "name": "BLDC Fan Uninstallation",
    "code": "FAN-BLDC-UNINST",
    "category": "Fan Services",
    "subcategory": "BLDC Fan",
    "description": "Safe removal of BLDC fan with receiver module, careful wire labeling, and canopy closure.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.8 ★ (290 reviews)",
    "price": 149,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_fan_bldc_uninstall.webp",
    "specifications": [
      {
        "label": "Receiver Module",
        "value": "Safely removed"
      },
      {
        "label": "Wire Labeling",
        "value": "Marked for reinstall"
      },
      {
        "label": "Canopy Closure",
        "value": "Included"
      }
    ]
  },
  {
    "id": "fan-bldc-service",
    "name": "BLDC Fan Service Charge",
    "code": "FAN-BLDC-SVC",
    "category": "Fan Services",
    "subcategory": "BLDC Fan",
    "description": "Cleaning BLDC fan blades, checking remote receiver module, inspecting motor bearings, and verifying all speed settings.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.8 ★ (190 reviews)",
    "price": 199,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_fan_bldc_service.webp",
    "specifications": [
      {
        "label": "Blade Cleaning",
        "value": "Deep wipe"
      },
      {
        "label": "Remote Check",
        "value": "All speeds tested"
      },
      {
        "label": "Bearing Lube",
        "value": "Applied if needed"
      }
    ]
  },
  {
    "id": "fan-fancy-install",
    "name": "Decorative Fan Installation",
    "code": "FAN-DEC-INST",
    "category": "Fan Services",
    "subcategory": "Fancy / Decorative Fan",
    "description": "Installing designer or decorative ceiling fans with wooden/acrylic blades, LED light kit wiring, and careful canopy fitting.",
    "iconName": "Zap",
    "duration": "1 hour",
    "rating": "4.9 ★ (410 reviews)",
    "price": 469,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/fancy-fan-installation-noida-extension.webp",
    "specifications": [
      {
        "label": "Fan Type",
        "value": "Designer / Wooden blade"
      },
      {
        "label": "LED Light Kit",
        "value": "Wired if provided"
      },
      {
        "label": "Balance Check",
        "value": "Vibration-free"
      }
    ]
  },
  {
    "id": "fan-fancy-uninstall",
    "name": "Decorative Fan Uninstallation",
    "code": "FAN-DEC-UNINST",
    "category": "Fan Services",
    "subcategory": "Fancy / Decorative Fan",
    "description": "Careful dismounting of decorative fan with blade protectors, LED module disconnect, and safe packing guidance.",
    "iconName": "Zap",
    "duration": "40 mins",
    "rating": "4.8 ★ (150 reviews)",
    "price": 249,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_fan_fancy_uninstall.webp",
    "specifications": [
      {
        "label": "Blade Protection",
        "value": "Careful removal"
      },
      {
        "label": "LED Disconnect",
        "value": "Safe wire-off"
      },
      {
        "label": "Packing Guidance",
        "value": "Advised"
      }
    ]
  },
  {
    "id": "fan-fancy-repair",
    "name": "Decorative Fan Repair",
    "code": "FAN-DEC-REP",
    "category": "Fan Services",
    "subcategory": "Fancy / Decorative Fan",
    "description": "Repairing speed issues, LED light flickering, blade wobble correction, capacitor check, and remote pairing for decorative fans.",
    "iconName": "Zap",
    "duration": "45 mins",
    "rating": "4.8 ★ (210 reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_fan_fancy_repair.webp",
    "specifications": [
      {
        "label": "LED Light Fix",
        "value": "Driver checked"
      },
      {
        "label": "Blade Balance",
        "value": "Weight calibrated"
      },
      {
        "label": "Capacitor",
        "value": "Replaced if needed"
      }
    ]
  },
  {
    "id": "light-bulb-install",
    "name": "Bulb Holder Installation",
    "code": "LGT-BH-INST",
    "category": "Light Services",
    "subcategory": "Bulb Holder",
    "description": "Installing ceiling rose bulb holder, connecting live/neutral/earth wires, and checking circuit for safe operation.",
    "iconName": "Zap",
    "duration": "15 mins",
    "rating": "4.9 ★ (920 reviews)",
    "price": 49,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/bulb-holder-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Holder Type",
        "value": "B22 / E27 standard"
      },
      {
        "label": "Wire Connection",
        "value": "Live/Neutral/Earth"
      },
      {
        "label": "Safety Check",
        "value": "Included"
      }
    ]
  },
  {
    "id": "light-bulb-repair",
    "name": "Bulb Holder Repair",
    "code": "LGT-BH-REP",
    "category": "Light Services",
    "subcategory": "Bulb Holder",
    "description": "Fixing loose holder connections, burnt terminals, spark issues, and replacing faulty ceiling rose or batten holders.",
    "iconName": "Zap",
    "duration": "15 mins",
    "rating": "4.8 ★ (430 reviews)",
    "price": 69,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_light_bulb_repair.webp",
    "specifications": [
      {
        "label": "Terminal Check",
        "value": "Burnt/loose fixed"
      },
      {
        "label": "Holder Grade",
        "value": "IS-Mark ceramic"
      },
      {
        "label": "Circuit Test",
        "value": "Included"
      }
    ]
  },
  {
    "id": "light-tube-install",
    "name": "Tube Light / Batten Installation",
    "code": "LGT-TL-INST",
    "category": "Light Services",
    "subcategory": "Tube Light",
    "description": "Mounting LED tube batten on ceiling or wall, wiring connection, switch loop, and illumination check.",
    "iconName": "Zap",
    "duration": "20 mins",
    "rating": "4.9 ★ (1.1k reviews)",
    "price": 99,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/tube-light-installation-greater-noida.webp",
    "specifications": [
      {
        "label": "Tube Type",
        "value": "LED T5 / T8 batten"
      },
      {
        "label": "Mounting",
        "value": "Ceiling / wall surface"
      },
      {
        "label": "Switch Loop",
        "value": "Included"
      }
    ]
  },
  {
    "id": "light-tube-repair",
    "name": "Tube Light Repair",
    "code": "LGT-TL-REP",
    "category": "Light Services",
    "subcategory": "Tube Light",
    "description": "Fixing flickering tube lights, replacing LED drivers, starter and choke replacement, and wiring checks.",
    "iconName": "Zap",
    "duration": "20 mins",
    "rating": "4.8 ★ (540 reviews)",
    "price": 99,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_light_tube_repair.webp",
    "specifications": [
      {
        "label": "Driver Replaced",
        "value": "OEM LED driver"
      },
      {
        "label": "Starter/Choke",
        "value": "Checked & replaced"
      },
      {
        "label": "Flicker Test",
        "value": "Zero flicker confirmed"
      }
    ]
  },
  {
    "id": "light-tube-uninstall",
    "name": "Tube Light Uninstallation",
    "code": "LGT-TL-UNINST",
    "category": "Light Services",
    "subcategory": "Tube Light",
    "description": "Safe removal of tube light or batten fitting, wire capping, and ceiling clip removal without surface damage.",
    "iconName": "Zap",
    "duration": "15 mins",
    "rating": "4.8 ★ (240 reviews)",
    "price": 79,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_light_tube_uninstall.webp",
    "specifications": [
      {
        "label": "Wire Capping",
        "value": "Included"
      },
      {
        "label": "Clip Removal",
        "value": "No surface damage"
      },
      {
        "label": "Ceiling Finish",
        "value": "Patch-ready"
      }
    ]
  },
  {
    "id": "light-fancy-install",
    "name": "Fancy / Wall Light Installation",
    "code": "LGT-FL-INST",
    "category": "Light Services",
    "subcategory": "Fancy Light",
    "description": "Installing decorative wall sconces, fancy LED panels, and profile lights with wiring, switch connection, and leveling.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.9 ★ (490 reviews)",
    "price": 149,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/fancy-light-repair-noida-extension.webp",
    "specifications": [
      {
        "label": "Light Type",
        "value": "Sconce / panel / cove"
      },
      {
        "label": "Switch Wiring",
        "value": "Included"
      },
      {
        "label": "Leveling",
        "value": "Spirit level checked"
      }
    ]
  },
  {
    "id": "light-fancy-repair",
    "name": "Fancy Light Repair",
    "code": "LGT-FL-REP",
    "category": "Light Services",
    "subcategory": "Fancy Light",
    "description": "Diagnosing and repairing flickering fancy lights, LED strip driver replacement, loose connections, and dimmer faults.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.8 ★ (270 reviews)",
    "price": 149,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_light_fancy_repair.webp",
    "specifications": [
      {
        "label": "LED Driver",
        "value": "Replaced if faulty"
      },
      {
        "label": "Dimmer Check",
        "value": "Tested"
      },
      {
        "label": "Connection Tighten",
        "value": "All terminals"
      }
    ]
  },
  {
    "id": "light-ceiling-install",
    "name": "Ceiling / Panel Light Installation",
    "code": "LGT-CL-INST",
    "category": "Light Services",
    "subcategory": "Ceiling Light",
    "description": "Mounting round or square LED panel lights on false ceiling, POP surface, or gypsum, with wiring and dimmer setup.",
    "iconName": "Zap",
    "duration": "25 mins",
    "rating": "4.9 ★ (680 reviews)",
    "price": 89,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/ceiling-panel-light-installation-gaur-city.webp",
    "specifications": [
      {
        "label": "Panel Type",
        "value": "Round / Square LED"
      },
      {
        "label": "Ceiling Type",
        "value": "POP / gypsum / direct"
      },
      {
        "label": "Dimmer Ready",
        "value": "Optional"
      }
    ]
  },
  {
    "id": "light-chandelier-install",
    "name": "Chandelier / Hanging Light Installation",
    "code": "LGT-CH-INST",
    "category": "Light Services",
    "subcategory": "Ceiling Light",
    "description": "Safe hanging of heavy chandeliers with ceiling anchor bolt, earthing, canopy fitting, and all-bulb illumination test.",
    "iconName": "Zap",
    "duration": "1–2 hours",
    "rating": "4.9 ★ (340 reviews)",
    "price": 499,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/chandelier-installation-noida-extension.webp",
    "specifications": [
      {
        "label": "Mount Anchor",
        "value": "Heavy-duty ceiling bolt"
      },
      {
        "label": "Weight Capacity",
        "value": "Up to 20 kg"
      },
      {
        "label": "Earthing",
        "value": "Included"
      }
    ]
  },
  {
    "id": "light-ceiling-repair",
    "name": "Ceiling Light Repair",
    "code": "LGT-CL-REP",
    "category": "Light Services",
    "subcategory": "Ceiling Light",
    "description": "Fixing non-working ceiling lights, LED driver change, wiring faults, and loose canopy or mount bracket tightening.",
    "iconName": "Zap",
    "duration": "25 mins",
    "rating": "4.8 ★ (380 reviews)",
    "price": 129,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_light_ceiling_repair.webp",
    "specifications": [
      {
        "label": "LED Driver",
        "value": "OEM replacement"
      },
      {
        "label": "Wiring Fault",
        "value": "Traced & fixed"
      },
      {
        "label": "Mount Check",
        "value": "Tightened"
      }
    ]
  },
  {
    "id": "elec-switch-repair",
    "name": "Switch / Socket Repair & Replacement",
    "code": "ELE-SWT",
    "category": "Electrician Services",
    "subcategory": "Switch & Socket",
    "description": "Replacing modular switches, multi-pin sockets, indicator lights, plug tops, and modular grid box repairs.",
    "iconName": "Zap",
    "duration": "20 mins",
    "rating": "4.9 ★ (920 reviews)",
    "price": 69,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/switchboard-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Safety Standard",
        "value": "IS-Mark certified"
      },
      {
        "label": "Load Threshold",
        "value": "Up to 16A slots"
      },
      {
        "label": "Grid Testing",
        "value": "Included"
      }
    ]
  },
  {
    "id": "elec-switchboard-repair",
    "name": "Switchboard Repair & Replacement",
    "code": "ELE-SBD",
    "category": "Electrician Services",
    "subcategory": "Switch & Socket",
    "description": "Repairing or replacing full modular switchboard panels, main board wiring, circuit tracing, and load balancing.",
    "iconName": "Zap",
    "duration": "30 mins",
    "rating": "4.9 ★ (680 reviews)",
    "price": 99,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_elec_switchboard_repair.webp",
    "specifications": [
      {
        "label": "Board Grade",
        "value": "Modular PVC/metal"
      },
      {
        "label": "Load Balance",
        "value": "Checked"
      },
      {
        "label": "Circuit Trace",
        "value": "Megger digital scan"
      }
    ]
  },
  {
    "id": "elec-newbox-install",
    "name": "New Switchbox Installation",
    "code": "ELE-NSW",
    "category": "Electrician Services",
    "subcategory": "Switch & Socket",
    "description": "Installing new electrical switchbox at desired location — chiseling, conduit laying, wiring, and modular fitting.",
    "iconName": "Settings",
    "duration": "1.5 hours",
    "rating": "4.8 ★ (340 reviews)",
    "price": 149,
    "warranty": "60 Days Warranty",
    "imageUrl": "/images/services/svc_elec_newbox_install.webp",
    "specifications": [
      {
        "label": "Conduit Laying",
        "value": "Concealed / surface"
      },
      {
        "label": "Wire Grade",
        "value": "FR-LSH Grade 1"
      },
      {
        "label": "Modular Frame",
        "value": "Fitted & tested"
      }
    ]
  },
  {
    "id": "elec-mcb",
    "name": "MCB & Distribution Box Upgrade",
    "code": "ELE-MCB",
    "category": "Electrician Services",
    "subcategory": "MCB & Wiring",
    "description": "Replacing old fuses with smart MCBs, RCCB shock protector installation, sub-distribution board fitting, and earth check.",
    "iconName": "Settings",
    "duration": "1 hour",
    "rating": "4.9 ★ (720 reviews)",
    "price": 399,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/svc_mcb_upgrade.webp",
    "specifications": [
      {
        "label": "Trip Response",
        "value": "< 30ms verified"
      },
      {
        "label": "MCB Rating",
        "value": "B-Curve residential"
      },
      {
        "label": "DB Box Grade",
        "value": "Double-door metal"
      }
    ]
  },
  {
    "id": "elec-wiring",
    "name": "House Wiring & Circuit Tracing",
    "code": "ELE-WIRE",
    "category": "Electrician Services",
    "subcategory": "MCB & Wiring",
    "description": "Full residential wiring trace, earth leak detection, open circuit repair, short-circuit diagnostics, and conduit setup.",
    "iconName": "Activity",
    "duration": "2–4 hours",
    "rating": "4.9 ★ (1.6k reviews)",
    "price": 999,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/svc_house_wiring.webp",
    "specifications": [
      {
        "label": "Wire Grade",
        "value": "FR-LSH Grade 1"
      },
      {
        "label": "Isolation Check",
        "value": "Megger digital scan"
      },
      {
        "label": "Earthing Check",
        "value": "Included"
      }
    ]
  },
  {
    "id": "elec-doorbell",
    "name": "Doorbell & Intercom Repair",
    "code": "ELE-BEL",
    "category": "Electrician Services",
    "subcategory": "Switch & Socket",
    "description": "Repairing multi-tune doorbells, wiring checks for digital doorbells, and troubleshooting intercom lines.",
    "iconName": "Phone",
    "duration": "30 mins",
    "rating": "4.9 ★ (310 reviews)",
    "price": 99,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/doorbell-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Intercom Lines",
        "value": "2-core/4-core tested"
      },
      {
        "label": "Bell Transformer",
        "value": "Checked"
      },
      {
        "label": "Switch Replace",
        "value": "IS-Mark waterproof"
      }
    ]
  },
  {
    "id": "elec-inverter",
    "name": "Inverter & Battery Service",
    "code": "ELE-INV",
    "category": "Electrician Services",
    "subcategory": "MCB & Wiring",
    "description": "Inverter diagnostics, battery acid refilling, terminal corrosion cleaning, backup time check, and circuit repairs.",
    "iconName": "Activity",
    "duration": "45 mins",
    "rating": "4.9 ★ (510 reviews)",
    "price": 249,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/inverter-battery-service-greater-noida.webp",
    "specifications": [
      {
        "label": "Backup Test",
        "value": "Load checked"
      },
      {
        "label": "Battery Terminal",
        "value": "Anti-corrosion spray"
      },
      {
        "label": "Acid Top-up",
        "value": "Included"
      }
    ]
  },
  {
    "id": "app-ro-repair",
    "name": "RO Purifier Repair & Diagnostics",
    "code": "APP-RO-REP",
    "category": "Appliance Repair",
    "subcategory": "Water Purifier",
    "description": "Expert diagnostics for low water flow, taste issues, leakage, continuously running pump, or power supply failure.",
    "iconName": "Wrench",
    "duration": "45 mins",
    "rating": "4.8 ★ (1.2k reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/ro-water-purifier-repair-noida-extension.webp",
    "specifications": [
      {
        "label": "Diagnostics",
        "value": "Complete electrical scan"
      },
      {
        "label": "Booster Pump Check",
        "value": "Pressure gauge tested"
      },
      {
        "label": "Leak Fix",
        "value": "Connector seals checked"
      }
    ]
  },
  {
    "id": "app-ro-service",
    "name": "RO Purifier Filter Service",
    "code": "APP-RO-SVC",
    "category": "Appliance Repair",
    "subcategory": "Water Purifier",
    "description": "Caustic soda flushing, replacement of sediment and pre-carbon filters, checking RO membrane health, and TDS calibration.",
    "iconName": "Droplets",
    "duration": "1 hour",
    "rating": "4.9 ★ (1.8k reviews)",
    "price": 399,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_ro_filter_service.webp",
    "specifications": [
      {
        "label": "Sediment Filter",
        "value": "Replaced (Premium)"
      },
      {
        "label": "Pre-Carbon Filter",
        "value": "Replaced (Premium)"
      },
      {
        "label": "TDS Calibration",
        "value": "Target 80-120 ppm"
      }
    ]
  },
  {
    "id": "app-ro-install",
    "name": "RO Purifier Installation",
    "code": "APP-RO-INST",
    "category": "Appliance Repair",
    "subcategory": "Water Purifier",
    "description": "Wall-mounting water purifier, connecting inlet diverter valve, waste water drain ducting, and initial water level testing.",
    "iconName": "Settings",
    "duration": "1 hour",
    "rating": "4.9 ★ (640 reviews)",
    "price": 499,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/best-ro-service-greater-noida.webp",
    "specifications": [
      {
        "label": "Wall Mount",
        "value": "Secure anchor bolts"
      },
      {
        "label": "Diverter Valve",
        "value": "Heavy-duty brass"
      },
      {
        "label": "First Fill Run",
        "value": "TDS & leak checked"
      }
    ]
  },
  {
    "id": "app-ro-uninstall",
    "name": "RO Purifier Uninstallation",
    "code": "APP-RO-UNINST",
    "category": "Appliance Repair",
    "subcategory": "Water Purifier",
    "description": "Dismounting water purifier unit, safe removal of diverter valve, capping plumbing line, and draining internal storage tank.",
    "iconName": "Wrench",
    "duration": "30 mins",
    "rating": "4.8 ★ (280 reviews)",
    "price": 299,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_app_ro_uninstall.webp",
    "specifications": [
      {
        "label": "Tank Drainage",
        "value": "100% emptied"
      },
      {
        "label": "Diverter Safe Capping",
        "value": "Plumbing line sealed"
      },
      {
        "label": "Safe Dismounting",
        "value": "No wall damage"
      }
    ]
  },
  {
    "id": "app-washing-repair",
    "name": "Washing Machine Repair & Diagnostics",
    "code": "APP-WASH-REP",
    "category": "Appliance Repair",
    "subcategory": "Washing Machine",
    "description": "Diagnosing drum spinning failure, extreme vibrations, drain pump blockage, water inlet failures, or digital PCB card faults.",
    "iconName": "Wrench",
    "duration": "1 hour",
    "rating": "4.8 ★ (1.4k reviews)",
    "price": 249,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/washing-machine-repair-gaur-city.webp",
    "specifications": [
      {
        "label": "Diagnostics",
        "value": "Motor & sensor checks"
      },
      {
        "label": "PCB Card Scan",
        "value": "Voltage & relays tested"
      },
      {
        "label": "Parts Guarantee",
        "value": "Genuine OEM spares"
      }
    ]
  },
  {
    "id": "app-washing-install",
    "name": "Washing Machine Installation",
    "code": "APP-WASH-INST",
    "category": "Appliance Repair",
    "subcategory": "Washing Machine",
    "description": "Unboxing, transit bolt removal, levelling adjusters setup, inlet hose hookup to tap, drain pipe routing, and trial spin run.",
    "iconName": "Settings",
    "duration": "45 mins",
    "rating": "4.9 ★ (880 reviews)",
    "price": 399,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/washing-machine-service-greater-noida.webp",
    "specifications": [
      {
        "label": "Transit Bolts",
        "value": "Safely removed"
      },
      {
        "label": "Levelling",
        "value": "Vibration-free calibration"
      },
      {
        "label": "Trial Spin",
        "value": "Water leak test included"
      }
    ]
  },
  {
    "id": "app-washing-uninstall",
    "name": "Washing Machine Uninstallation",
    "code": "APP-WASH-UNINST",
    "category": "Appliance Repair",
    "subcategory": "Washing Machine",
    "description": "Disconnecting water inlet hose and drain pipe, reinstalling transit bolts for safe transport, and packing cables securely.",
    "iconName": "Settings",
    "duration": "30 mins",
    "rating": "4.8 ★ (320 reviews)",
    "price": 199,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_app_washing_uninstall.webp",
    "specifications": [
      {
        "label": "Transit Bolt Setup",
        "value": "Reinstalled for safety"
      },
      {
        "label": "Hose Drain",
        "value": "Drained and capped"
      },
      {
        "label": "Power Cord Wrap",
        "value": "Secured with ties"
      }
    ]
  },
  {
    "id": "app-washing-service",
    "name": "Washing Machine Tub Deep Clean",
    "code": "APP-WASH-SVC",
    "category": "Appliance Repair",
    "subcategory": "Washing Machine",
    "description": "Scale remover flush, lint filter cleaning, high-pressure jet washing of detergent drawer, and drum sanitization.",
    "iconName": "Droplets",
    "duration": "1.5 hours",
    "rating": "4.9 ★ (1.1k reviews)",
    "price": 499,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_washing_tub_clean.webp",
    "specifications": [
      {
        "label": "Scale Removal",
        "value": "Eco tub cleaner"
      },
      {
        "label": "Jet Spray Wash",
        "value": "High pressure clean"
      },
      {
        "label": "Bacterial Sanitizer",
        "value": "Applied"
      }
    ]
  },
  {
    "id": "app-geyser-repair",
    "name": "Geyser Repair & Diagnostics",
    "code": "APP-GEY-REP",
    "category": "Appliance Repair",
    "subcategory": "Geyser",
    "description": "Diagnosing no-heating issues, water leakage from tank, thermostat tripping, power short circuits, or indicator light faults.",
    "iconName": "Wrench",
    "duration": "45 mins",
    "rating": "4.8 ★ (1.2k reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/geyser-repair-noida-extension.webp",
    "specifications": [
      {
        "label": "Thermostat Tripped",
        "value": "Diagnosed & replaced"
      },
      {
        "label": "Tank Leakage",
        "value": "Connector seals checked"
      },
      {
        "label": "Safety Cutout",
        "value": "Verified"
      }
    ]
  },
  {
    "id": "app-geyser-service",
    "name": "Geyser Descaling & Maintenance",
    "code": "APP-GEY-SVC",
    "category": "Appliance Repair",
    "subcategory": "Geyser",
    "description": "Draining geyser tank, chemical descaling of the heating element, anode rod status check, and pressure release valve test.",
    "iconName": "Flame",
    "duration": "1 hour",
    "rating": "4.9 ★ (1.4k reviews)",
    "price": 599,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/svc_geyser_descaling.webp",
    "specifications": [
      {
        "label": "Tank Descaling",
        "value": "Acid-free chemical wash"
      },
      {
        "label": "Anode Rod Check",
        "value": "Corrosion scan"
      },
      {
        "label": "Element Cleaning",
        "value": "Scale completely removed"
      }
    ]
  },
  {
    "id": "app-geyser-install",
    "name": "Geyser Installation",
    "code": "APP-GEY-INST",
    "category": "Appliance Repair",
    "subcategory": "Geyser",
    "description": "Secure wall mounting, connecting CPVC inlet/outlet connections, electrical connection, earthing safety check, and leak testing.",
    "iconName": "Settings",
    "duration": "1 hour",
    "rating": "4.9 ★ (920 reviews)",
    "price": 499,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/geyser-service-greater-noida.webp",
    "specifications": [
      {
        "label": "Anchor Bolts",
        "value": "Heavy-duty wall anchors"
      },
      {
        "label": "Earthing Safety",
        "value": "Leakage current verified"
      },
      {
        "label": "Leakage Check",
        "value": "Included"
      }
    ]
  },
  {
    "id": "app-geyser-uninstall",
    "name": "Geyser Uninstallation",
    "code": "APP-GEY-UNINST",
    "category": "Appliance Repair",
    "subcategory": "Geyser",
    "description": "Draining internal geyser tank safely, disconnecting inlet/outlet pipes, dismounting the unit, and capping connection valves.",
    "iconName": "Settings",
    "duration": "30 mins",
    "rating": "4.8 ★ (380 reviews)",
    "price": 199,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_app_geyser_uninstall.webp",
    "specifications": [
      {
        "label": "Tank Drainage",
        "value": "Safely emptied"
      },
      {
        "label": "Valve Capping",
        "value": "Plumbing line capped"
      },
      {
        "label": "Wall Mounts",
        "value": "Carefully removed"
      }
    ]
  },
  {
    "id": "app-fridge-repair",
    "name": "Refrigerator Repair & Diagnostics",
    "code": "APP-REF-REP",
    "category": "Appliance Repair",
    "subcategory": "Refrigerator",
    "description": "Diagnosing no-cooling issues, compressor start failure, clicking noise, capillary blockage, or thermostat malfunction.",
    "iconName": "Wrench",
    "duration": "1 hour",
    "rating": "4.8 ★ (1.1k reviews)",
    "price": 249,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/fridge-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Relay Check",
        "value": "Replaced if faulty"
      },
      {
        "label": "Compressor Load",
        "value": "Amperage tested"
      },
      {
        "label": "Thermostat Scan",
        "value": "Calibrated"
      }
    ]
  },
  {
    "id": "app-fridge-gas-single",
    "name": "Single-Door Refrigerator Gas Charging",
    "code": "APP-REF-GAS-S",
    "category": "Appliance Repair",
    "subcategory": "Refrigerator",
    "description": "Nitrogen pressure testing, leak detection, vacuuming, and eco-friendly R134a/R600a gas charging for single-door fridges.",
    "iconName": "Droplets",
    "duration": "1.5 hours",
    "rating": "4.9 ★ (820 reviews)",
    "price": 999,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/svc_fridge_gas_charging.webp",
    "specifications": [
      {
        "label": "Gas Code",
        "value": "R134a / R600a (Genuine)"
      },
      {
        "label": "Vacuum Process",
        "value": "Deep vacuum pump run"
      },
      {
        "label": "Leak Test",
        "value": "Bubble & sensor verified"
      }
    ]
  },
  {
    "id": "app-fridge-gas-double",
    "name": "Double-Door Refrigerator Gas Charging",
    "code": "APP-REF-GAS-D",
    "category": "Appliance Repair",
    "subcategory": "Refrigerator",
    "description": "Leak detection, nitrogen flush, condenser vacuuming, and gas refilling for double-door or frost-free refrigerators.",
    "iconName": "Droplets",
    "duration": "2 hours",
    "rating": "4.9 ★ (740 reviews)",
    "price": 1499,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/refrigerator-gas-charging-greater-noida.webp",
    "specifications": [
      {
        "label": "Gas Code",
        "value": "Premium Eco Gas"
      },
      {
        "label": "Nitrogen Flush",
        "value": "High pressure purge"
      },
      {
        "label": "Cooling Test",
        "value": "Frost & coil check"
      }
    ]
  },
  {
    "id": "app-fridge-service",
    "name": "Refrigerator Deep Cleaning Service",
    "code": "APP-REF-SVC",
    "category": "Appliance Repair",
    "subcategory": "Refrigerator",
    "description": "Removing shelves, deep chemical sanitization, cleaning condenser coils from dust, and door gasket mould cleaning.",
    "iconName": "Droplets",
    "duration": "1.5 hours",
    "rating": "4.9 ★ (580 reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/refrigerator-service-gaur-city.webp",
    "specifications": [
      {
        "label": "Sanitization",
        "value": "Anti-bacterial wipe"
      },
      {
        "label": "Condenser Clean",
        "value": "Dust vacuumed"
      },
      {
        "label": "Gasket Clean",
        "value": "Mould completely removed"
      }
    ]
  },
  {
    "id": "app-microwave-repair",
    "name": "Microwave Oven Repair",
    "code": "APP-MCR-REP",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Diagnosing magnetron failures, turntable motor replacement, spark issues, keyboard/button faults, or power fuse blows.",
    "iconName": "Wrench",
    "duration": "45 mins",
    "rating": "4.8 ★ (510 reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/microwave-repair-greater-noida.webp",
    "specifications": [
      {
        "label": "Magnetron Check",
        "value": "OEM replacement"
      },
      {
        "label": "Turntable Motor",
        "value": "Genuine replacement"
      },
      {
        "label": "Radiation Scan",
        "value": "Safety check included"
      }
    ]
  },
  {
    "id": "app-microwave-service",
    "name": "Microwave Deep Clean & Sanitization",
    "code": "APP-MCR-SVC",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Eco-clean steam degreasing, carbon spot removal, high-temperature sanitization, and outer body polish.",
    "iconName": "Droplets",
    "duration": "30 mins",
    "rating": "4.8 ★ (240 reviews)",
    "price": 199,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_microwave_cleaning.webp",
    "specifications": [
      {
        "label": "Steam Degreasing",
        "value": "100% natural steam"
      },
      {
        "label": "Carbon Spots",
        "value": "Gently scrubbed off"
      },
      {
        "label": "Outer Polish",
        "value": "Included"
      }
    ]
  },
  {
    "id": "app-chimney-repair",
    "name": "Kitchen Chimney Repair & Diagnostics",
    "code": "APP-CHM-REP",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Troubleshooting low suction power, motor jamming, push-button/touch control panel malfunction, or auto-clean coil failures.",
    "iconName": "Wrench",
    "duration": "1 hour",
    "rating": "4.8 ★ (620 reviews)",
    "price": 299,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/kitchen-chimney-repair-gaur-city.webp",
    "specifications": [
      {
        "label": "Suction diagnostics",
        "value": "Anemometer measured"
      },
      {
        "label": "Motor winding",
        "value": "Resistance scanned"
      },
      {
        "label": "Control card",
        "value": "Checked and repaired"
      }
    ]
  },
  {
    "id": "app-chimney-install",
    "name": "Kitchen Chimney Installation",
    "code": "APP-CHM-INST",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Wall mounting chimney hood, drilling exhaust duct hole, routing flexible aluminium duct pipe, and initial speed testing.",
    "iconName": "Settings",
    "duration": "1.5 hours",
    "rating": "4.9 ★ (790 reviews)",
    "price": 799,
    "warranty": "90 Days Warranty",
    "imageUrl": "/images/services/kitchen-chimney-installation-gaur-city.webp",
    "specifications": [
      {
        "label": "Drilling Mount",
        "value": "Heavy-duty wall anchors"
      },
      {
        "label": "Duct Routing",
        "value": "Standard aluminum pipe"
      },
      {
        "label": "Vibration Dampening",
        "value": "Calibrated"
      }
    ]
  },
  {
    "id": "app-chimney-uninstall",
    "name": "Kitchen Chimney Uninstallation",
    "code": "APP-CHM-UNINST",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Carefully dismounting chimney hood from wall, removing flexible duct pipe, and safe sealing of duct hole.",
    "iconName": "Settings",
    "duration": "45 mins",
    "rating": "4.8 ★ (310 reviews)",
    "price": 399,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/svc_app_chimney_uninstall.webp",
    "specifications": [
      {
        "label": "Safe Dismount",
        "value": "Zero tile/wall damage"
      },
      {
        "label": "Duct pipe removal",
        "value": "Standard cleaning"
      },
      {
        "label": "Hole sealing",
        "value": "Available on demand"
      }
    ]
  },
  {
    "id": "app-chimney-service",
    "name": "Kitchen Chimney Deep Service",
    "code": "APP-CHM-SVC",
    "category": "Appliance Repair",
    "subcategory": "Other Appliances",
    "description": "Full chimney dismantling, caustic soda chemical boil-wash of grease-clogged baffle filters, blower degreasing, and suction check.",
    "iconName": "Flame",
    "duration": "1.5 hours",
    "rating": "4.9 ★ (1.2k reviews)",
    "price": 499,
    "warranty": "30 Days Warranty",
    "imageUrl": "/images/services/chimney-cleaning-service-greater-noida.webp",
    "specifications": [
      {
        "label": "Grease Boil Wash",
        "value": "Caustic soda chemical wash"
      },
      {
        "label": "Suction Power",
        "value": "Restored up to +40%"
      },
      {
        "label": "Blower Cleaning",
        "value": "Degreased & balanced"
      }
    ]
  },
  {
    "id": "home-pigeon",
    "name": "Balcony Pigeon Net Installation",
    "code": "HOM-NET",
    "category": "Home Installations",
    "subcategory": "Book a consultation",
    "description": "Robust HDPE nylon safety nets, stainless steel anchor hooks, and pigeon bird-proofing layout grids for any balcony size.",
    "iconName": "Shield",
    "duration": "3 hours",
    "rating": "4.9 ★ (640 reviews)",
    "price": 1200,
    "warranty": "3 Year Warranty",
    "imageUrl": "/images/services/balcony-pigeon-net-installation-greater-noida.webp",
    "specifications": [
      {
        "label": "Net Mesh",
        "value": "HDPE UV Stabilized Nylon"
      },
      {
        "label": "Hook Anchors",
        "value": "Stainless steel 304"
      },
      {
        "label": "Warranty Scope",
        "value": "3 Years full coverage"
      }
    ]
  },
  {
    "id": "home-plumber",
    "name": "Doorstep Plumbing Utilities",
    "code": "HOM-PLM",
    "category": "Home Installations",
    "subcategory": "Book a consultation",
    "description": "Faucet leak repair, sink pipe blockages, washbasin installations, and toilet flush valve checkups.",
    "iconName": "Wrench",
    "duration": "1 hour",
    "rating": "4.7 ★ (1.1k reviews)",
    "price": 199,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/plumbing-services-greater-noida.webp",
    "specifications": [
      {
        "label": "Pipe Sealants",
        "value": "Teflon & anaerobic paste"
      },
      {
        "label": "Fitting Grade",
        "value": "ASTM UPVC / CPVC"
      },
      {
        "label": "Flow Pressure",
        "value": "Up to 8 Bar"
      }
    ]
  },
  {
    "id": "home-carpenter",
    "name": "Carpentry Adjustments & Repairs",
    "code": "HOM-CRP",
    "category": "Home Installations",
    "subcategory": "Book a consultation",
    "description": "Replacing door locks, drawer slider fittings, kitchen cabinet hinge realignments, and minor wood fixes.",
    "iconName": "Hammer",
    "duration": "1.5 hours",
    "rating": "4.8 ★ (820 reviews)",
    "price": 249,
    "warranty": "15 Days Warranty",
    "imageUrl": "/images/services/carpentry-work-gaur-city.webp",
    "specifications": [
      {
        "label": "SS Hinge Check",
        "value": "Soft-close checked"
      },
      {
        "label": "Cutting Accuracy",
        "value": "Under Â±0.5 mm"
      },
      {
        "label": "Polish Touch",
        "value": "Included for repairs"
      }
    ]
  },
  {
    "id": "home-ceiling",
    "name": "Gypsum False Ceiling Service",
    "code": "HOM-CLG",
    "category": "Home Installations",
    "subcategory": "Book a consultation",
    "description": "Designing false ceilings, G.I. metallic support grids, gypsum paneling, cove light fittings, and finishing coat.",
    "iconName": "Layout",
    "duration": "2–3 Days",
    "rating": "4.9 ★ (210 reviews)",
    "price": 4999,
    "warranty": "5 Year Warranty",
    "imageUrl": "/images/services/gypsum-false-ceiling-noida-extension.webp",
    "specifications": [
      {
        "label": "Gypsum Board",
        "value": "Saint-Gobain Gyproc"
      },
      {
        "label": "Metal Grid Frame",
        "value": "Galvanized iron"
      },
      {
        "label": "Fire Rating",
        "value": "Class 0 certified"
      }
    ]
  }
];
