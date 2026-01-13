/**
 * Script de prueba para verificar el diagnóstico automático
 * basado en medicamentos
 */

// Copiar la función analyzeSymptoms del archivo api/analyze.js
function analyzeSymptoms(medications) {
  const characters = new Set(['TÚ']);
  const medicationChars = [];

  const disorderScores = {
    depression: 0,
    anxiety: 0,
    adhd: 0,
    bipolar: 0,
    bpd: 0,
    ocd: 0,
    ptsd: 0,
    insomnia: 0
  };

  medications.forEach(med => {
    const name = med.name.toLowerCase();
    const dosage = med.dosage;

    medicationChars.push({
      name: `${med.name.toUpperCase()} ${med.dosage}MG`,
      type: 'medication'
    });

    // SSRIs
    if (name.includes('sertralin') || name.includes('fluoxetin') ||
        name.includes('escitalopram') || name.includes('paroxetin') ||
        name.includes('citalopram') || name.includes('fluvoxamin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('SISTEMA DE ALARMA');

      disorderScores.depression += 2;
      disorderScores.anxiety += 2;
      disorderScores.ptsd += 1;

      if (dosage >= 80) {
        disorderScores.ocd += 3;
      }
      if (dosage >= 150) {
        disorderScores.ocd += 2;
      }
    }

    // SNRIs
    if (name.includes('venlafaxin') || name.includes('duloxetin') ||
        name.includes('desvenlafaxin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('SISTEMA DE ALARMA');
      characters.add('CUERPO');

      disorderScores.depression += 2;
      disorderScores.anxiety += 2;
      disorderScores.ptsd += 1;
    }

    // Gabapentinoides
    if (name.includes('pregabalin') || name.includes('gabapentin')) {
      characters.add('SISTEMA DE ALARMA');
      characters.add('CUERPO');

      disorderScores.anxiety += 3;
      disorderScores.ptsd += 1;
    }

    // Benzodiacepinas
    if (name.includes('clonazepam') || name.includes('alprazolam') ||
        name.includes('lorazepam') || name.includes('diazepam')) {
      characters.add('SISTEMA DE ALARMA');

      disorderScores.anxiety += 3;
      disorderScores.ptsd += 1;

      if (name.includes('alprazolam')) {
        disorderScores.anxiety += 1;
      }
    }

    // Estimulantes
    if (name.includes('metilfenidat') || name.includes('lisdexanfetamin') ||
        name.includes('dexanfetamin') || name.includes('anfetamin')) {
      characters.add('FUNCIÓN EJECUTIVA');
      characters.add('ENFOQUE');

      disorderScores.adhd += 5;
    }

    // Estabilizadores del ánimo
    if (name.includes('litio') || name.includes('lamotrigin') ||
        name.includes('valproat') || name.includes('carbamazepin')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('ESTABILIZADOR DE ÁNIMO');

      disorderScores.bipolar += 4;
      disorderScores.bpd += 2;

      if (name.includes('litio')) {
        disorderScores.bipolar += 2;
      }

      if (name.includes('lamotrigin')) {
        disorderScores.bipolar += 1;
        disorderScores.depression += 1;
      }
    }

    // Antipsicóticos atípicos
    if (name.includes('quetiap') || name.includes('olanzap') ||
        name.includes('aripiprazol') || name.includes('risperidon')) {
      characters.add('FILTRO DE REALIDAD');
      characters.add('REGULACIÓN EMOCIONAL');

      if (dosage < 100) {
        disorderScores.bpd += 3;
        disorderScores.depression += 1;
        disorderScores.anxiety += 1;
        disorderScores.bipolar += 1;
      } else if (dosage >= 200) {
        disorderScores.bipolar += 3;
        disorderScores.bpd += 1;
      } else {
        disorderScores.bipolar += 2;
        disorderScores.bpd += 2;
      }

      disorderScores.ocd += 1;
    }

    // Medicamentos para el sueño
    if (name.includes('trazodo') || name.includes('mirtazap') ||
        name.includes('zolpidem') || name.includes('zopiclone')) {
      characters.add('CICLO DE SUEÑO');
      if (!name.includes('zolpidem') && !name.includes('zopiclone')) {
        characters.add('REGULACIÓN EMOCIONAL');
      }

      disorderScores.insomnia += 2;
      disorderScores.depression += 1;

      if (name.includes('trazodo') || name.includes('mirtazap')) {
        if (dosage >= 100) {
          disorderScores.depression += 2;
        }
      }
    }

    // Antidepresivos atípicos
    if (name.includes('bupropion')) {
      characters.add('REGULACIÓN EMOCIONAL');
      characters.add('ENFOQUE');

      disorderScores.depression += 2;
      disorderScores.adhd += 1;
    }
  });

  if (characters.size === 1) {
    characters.add('MENTE');
    characters.add('CUERPO');
  }

  let primaryDisorder = 'general';
  let maxScore = 0;

  for (const [disorder, score] of Object.entries(disorderScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryDisorder = disorder;
    }
  }

  if (maxScore < 2) {
    primaryDisorder = 'general';
  }

  return {
    mentalAspects: Array.from(characters),
    medications: medicationChars,
    primaryDisorder: primaryDisorder,
    disorderScores: disorderScores
  };
}

// Casos de prueba
const testCases = [
  {
    name: 'Depresión típica',
    medications: [
      { name: 'Sertralina', dosage: 50, time: 'morning' }
    ]
  },
  {
    name: 'Ansiedad severa',
    medications: [
      { name: 'Clonazepam', dosage: 2, time: 'night' },
      { name: 'Pregabalina', dosage: 75, time: 'morning' }
    ]
  },
  {
    name: 'TDAH',
    medications: [
      { name: 'Metilfenidato', dosage: 20, time: 'morning' }
    ]
  },
  {
    name: 'Trastorno Bipolar',
    medications: [
      { name: 'Litio', dosage: 300, time: 'night' },
      { name: 'Quetiapina', dosage: 200, time: 'night' }
    ]
  },
  {
    name: 'TOC (dosis alta de SSRI)',
    medications: [
      { name: 'Fluoxetina', dosage: 80, time: 'morning' },
      { name: 'Aripiprazol', dosage: 10, time: 'morning' }
    ]
  },
  {
    name: 'Depresión + Ansiedad + Insomnio',
    medications: [
      { name: 'Escitalopram', dosage: 20, time: 'morning' },
      { name: 'Clonazepam', dosage: 1, time: 'night' },
      { name: 'Trazodona', dosage: 50, time: 'night' }
    ]
  },
  {
    name: 'TLP (Borderline)',
    medications: [
      { name: 'Lamotrigina', dosage: 100, time: 'morning' },
      { name: 'Quetiapina', dosage: 50, time: 'night' },
      { name: 'Sertralina', dosage: 100, time: 'morning' }
    ]
  },
  {
    name: 'TDAH + Depresión',
    medications: [
      { name: 'Metilfenidato', dosage: 30, time: 'morning' },
      { name: 'Bupropion', dosage: 150, time: 'morning' }
    ]
  }
];

// Ejecutar pruebas
console.log('🧪 PRUEBAS DE DIAGNÓSTICO AUTOMÁTICO\n');
console.log('='.repeat(60));

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log('-'.repeat(60));
  console.log('Medicamentos:', testCase.medications.map(m => `${m.name} ${m.dosage}mg`).join(', '));

  const result = analyzeSymptoms(testCase.medications);

  console.log('\n📊 Puntajes:');
  const sortedScores = Object.entries(result.disorderScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0);

  sortedScores.forEach(([disorder, score]) => {
    const bar = '█'.repeat(score);
    const isPrimary = disorder === result.primaryDisorder ? ' ⭐ PRIMARY' : '';
    console.log(`  ${disorder.padEnd(12)}: ${bar} (${score})${isPrimary}`);
  });

  console.log(`\n✅ Diagnóstico inferido: ${result.primaryDisorder.toUpperCase()}`);
  console.log(`👥 Personajes generados: ${result.mentalAspects.join(', ')}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Pruebas completadas\n');
