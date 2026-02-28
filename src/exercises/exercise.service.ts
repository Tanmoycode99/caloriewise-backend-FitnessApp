import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ExercisePlan, ExercisePlanDocument, ExerciseItem } from './exercise.schema';
import { CreateExerciseDto } from './exercise.dto';

interface ExerciseTemplate {
  name: string;
  category: string;
  description: string;
  baseDuration: number;
  sets: number;
  reps: string;
  baseCalories: number;
  intensity: string;
  muscleGroups: string[];
  equipmentNeeded: string[];
  notes: string;
  suitableFor: string[];
  contraindications: string[];
  timeOfDay: string;
  videoUrl: string;
  imageUrl: string;
  metsValue: number;
}

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(ExercisePlan.name)
    private exercisePlanModel: Model<ExercisePlanDocument>,
  ) {}

  private getAge(dob: string): number {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  private exerciseLibrary: ExerciseTemplate[] = [
    // ─── CARDIO ────────────────────────────────────────────────────────────────
    {
      name: 'Brisk Walking',
      category: 'cardio',
      description: 'A moderate-paced walk that elevates heart rate and burns fat efficiently without joint stress.',
      baseDuration: 30, sets: 1, reps: '30 min', baseCalories: 150, intensity: 'low',
      muscleGroups: ['legs', 'glutes', 'core'],
      equipmentNeeded: ['none'], notes: 'Keep pace conversational but slightly breathless.',
      suitableFor: ['lose', 'maintain', 'gain'],
      contraindications: [], timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=njeZ29umqVE',
      imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c',
      metsValue: 3.5,
    },
    {
      name: 'Jogging',
      category: 'cardio',
      description: 'Steady-state jogging that builds cardiovascular endurance and accelerates calorie burn.',
      baseDuration: 25, sets: 1, reps: '25 min', baseCalories: 250, intensity: 'medium',
      muscleGroups: ['quads', 'hamstrings', 'calves', 'core'],
      equipmentNeeded: ['running shoes'], notes: 'Land mid-foot to reduce knee impact.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['severe joint pain', 'osteoporosis'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=_kGESn8ArrU',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 7.0,
    },
    {
      name: 'Jump Rope',
      category: 'cardio',
      description: 'High-intensity skipping that torches calories and improves coordination.',
      baseDuration: 15, sets: 3, reps: '3 sets × 5 min', baseCalories: 200, intensity: 'high',
      muscleGroups: ['calves', 'shoulders', 'core', 'quads'],
      equipmentNeeded: ['jump rope'], notes: 'Avoid if you have knee pain.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['knee pain', 'thyroid severe'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE',
      imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3',
      metsValue: 10.0,
    },
    {
      name: 'Cycling (Stationary)',
      category: 'cardio',
      description: 'Low-impact cycling that improves cardiovascular fitness and leg strength.',
      baseDuration: 30, sets: 1, reps: '30 min', baseCalories: 220, intensity: 'medium',
      muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
      equipmentNeeded: ['stationary bike'], notes: 'Adjust resistance for progressive overload.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=4MhPFTCbJo4',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      metsValue: 6.8,
    },
    {
      name: 'Swimming Laps',
      category: 'cardio',
      description: 'Full-body low-impact cardio ideal for those with joint issues.',
      baseDuration: 30, sets: 1, reps: '30 min', baseCalories: 280, intensity: 'medium',
      muscleGroups: ['back', 'shoulders', 'core', 'legs'],
      equipmentNeeded: ['swimming pool'], notes: 'Alternate strokes: freestyle, breaststroke.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=gh5mAtmeR3Y',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
      metsValue: 7.0,
    },
    {
      name: 'Stair Climbing',
      category: 'cardio',
      description: 'Uses bodyweight to build lower-body strength and spike heart rate.',
      baseDuration: 20, sets: 3, reps: '3 × 5 min', baseCalories: 180, intensity: 'medium',
      muscleGroups: ['glutes', 'quads', 'calves'],
      equipmentNeeded: ['staircase'], notes: 'Push through heel to activate glutes.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['knee injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=O1kP7SgRTiA',
      imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      metsValue: 8.0,
    },
    {
      name: 'Rowing Machine',
      category: 'cardio',
      description: 'Full-body cardio that activates 86% of muscles while being low-impact.',
      baseDuration: 20, sets: 1, reps: '20 min', baseCalories: 210, intensity: 'medium',
      muscleGroups: ['back', 'biceps', 'core', 'quads', 'hamstrings'],
      equipmentNeeded: ['rowing machine'], notes: 'Maintain 60% legs / 30% back / 10% arms ratio.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['lower back injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=zAqnMoMjnOg',
      imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
      metsValue: 7.0,
    },
    {
      name: 'Dance Cardio (Zumba)',
      category: 'cardio',
      description: 'Fun rhythmic dancing that burns fat and boosts mood.',
      baseDuration: 40, sets: 1, reps: '40 min', baseCalories: 300, intensity: 'medium',
      muscleGroups: ['full body'],
      equipmentNeeded: ['none'], notes: 'Great for stress reduction.',
      suitableFor: ['lose', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=iAIxBTB1Z7Q',
      imageUrl: 'https://images.unsplash.com/photo-1519925610903-381054cc2a1c',
      metsValue: 6.5,
    },
    {
      name: 'Elliptical Trainer',
      category: 'cardio',
      description: 'Low-impact simulation of running that protects joints.',
      baseDuration: 30, sets: 1, reps: '30 min', baseCalories: 230, intensity: 'medium',
      muscleGroups: ['quads', 'glutes', 'hamstrings', 'arms'],
      equipmentNeeded: ['elliptical machine'], notes: 'Use arm handles for full-body activation.',
      suitableFor: ['lose', 'maintain', 'gain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=ue7V0PrFBCg',
      imageUrl: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb',
      metsValue: 5.5,
    },
    {
      name: 'HIIT Cardio Sprint Intervals',
      category: 'cardio',
      description: '20 sec max sprint + 40 sec walk × 10 rounds; powerful fat-burning protocol.',
      baseDuration: 20, sets: 10, reps: '20s on / 40s off', baseCalories: 300, intensity: 'high',
      muscleGroups: ['full body'],
      equipmentNeeded: ['none'], notes: 'Rest 1 day between sessions.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['heart conditions', 'thyroid uncontrolled'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=M0uO8X3_tEA',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      metsValue: 14.0,
    },

    // ─── YOGA ──────────────────────────────────────────────────────────────────
    {
      name: 'Sun Salutation (Surya Namaskar)',
      category: 'yoga',
      description: '12-pose sequence that warms up the body, improves flexibility, and balances hormones — excellent for thyroid health.',
      baseDuration: 20, sets: 5, reps: '5 rounds', baseCalories: 80, intensity: 'low',
      muscleGroups: ['full body'],
      equipmentNeeded: ['yoga mat'], notes: 'Synchronized breath with each movement.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=enry5C8QIIQ',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 2.5,
    },
    {
      name: 'Warrior II (Virabhadrasana II)',
      category: 'yoga',
      description: 'Strengthens legs and core while opening hips and chest.',
      baseDuration: 10, sets: 3, reps: '60 sec each side', baseCalories: 40, intensity: 'low',
      muscleGroups: ['quads', 'glutes', 'shoulders', 'core'],
      equipmentNeeded: ['yoga mat'], notes: 'Front knee should not pass toe.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=4Ejz7IgODlU',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      metsValue: 2.0,
    },
    {
      name: 'Boat Pose (Navasana)',
      category: 'yoga',
      description: 'Builds core strength and stimulates the thyroid and digestive organs.',
      baseDuration: 10, sets: 3, reps: '3 × 30 sec hold', baseCalories: 35, intensity: 'medium',
      muscleGroups: ['core', 'hip flexors', 'lower back'],
      equipmentNeeded: ['yoga mat'], notes: 'Great for thyroid stimulation.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['hernia'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=65mzjkFNgRI',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      metsValue: 2.8,
    },
    {
      name: 'Shoulder Stand (Sarvangasana)',
      category: 'yoga',
      description: 'Inverted pose that directly stimulates the thyroid gland by increasing blood flow to the neck.',
      baseDuration: 10, sets: 2, reps: '2 × 2 min hold', baseCalories: 30, intensity: 'low',
      muscleGroups: ['shoulders', 'core', 'neck'],
      equipmentNeeded: ['yoga mat'], notes: 'Highly beneficial for thyroid conditions.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['high blood pressure', 'neck injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=q4MJJDPomU4',
      imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0',
      metsValue: 2.0,
    },
    {
      name: 'Twisted Chair Pose (Parivrtta Utkatasana)',
      category: 'yoga',
      description: 'Detoxifying twist that improves thyroid function and burns thigh fat.',
      baseDuration: 8, sets: 3, reps: '3 × 30 sec each side', baseCalories: 35, intensity: 'medium',
      muscleGroups: ['quads', 'glutes', 'obliques', 'thoracic spine'],
      equipmentNeeded: ['yoga mat'], notes: 'Exhale deeply into the twist.',
      suitableFor: ['lose', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=3UOYQOT0xmk',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      metsValue: 2.5,
    },
    {
      name: 'Fish Pose (Matsyasana)',
      category: 'yoga',
      description: 'Opens the throat chakra and stretches the thyroid gland, stimulating hormone secretion.',
      baseDuration: 8, sets: 2, reps: '2 × 2 min hold', baseCalories: 20, intensity: 'low',
      muscleGroups: ['chest', 'throat', 'hip flexors'],
      equipmentNeeded: ['yoga mat'], notes: 'Gentle back arch; avoid forcing neck back.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['neck injury', 'high blood pressure'],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=1qNkJbVZsck',
      imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0',
      metsValue: 1.5,
    },
    {
      name: "Child's Pose (Balasana)",
      category: 'yoga',
      description: 'Restorative resting pose that relieves stress and lightly stretches the lower back.',
      baseDuration: 10, sets: 1, reps: '5 min hold', baseCalories: 15, intensity: 'low',
      muscleGroups: ['lower back', 'hips', 'thighs'],
      equipmentNeeded: ['yoga mat'], notes: 'Breathe deeply into the back body.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 1.0,
    },
    {
      name: 'Cobra Pose (Bhujangasana)',
      category: 'yoga',
      description: 'Stretches the spine, opens chest and stimulates thyroid via neck extension.',
      baseDuration: 8, sets: 3, reps: '3 × 30 sec hold', baseCalories: 25, intensity: 'low',
      muscleGroups: ['back extensors', 'chest', 'shoulders'],
      equipmentNeeded: ['yoga mat'], notes: 'Keep pubic bone on mat; gentle lift.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['severe back pain'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=JDcdhTuycOI',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      metsValue: 1.8,
    },
    {
      name: 'Bridge Pose (Setu Bandhasana)',
      category: 'yoga',
      description: 'Strengthens glutes and lower back while stimulating thyroid gland.',
      baseDuration: 10, sets: 3, reps: '3 × 45 sec hold', baseCalories: 30, intensity: 'low',
      muscleGroups: ['glutes', 'hamstrings', 'lower back', 'core'],
      equipmentNeeded: ['yoga mat'], notes: 'Press heels to activate hamstrings.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=cyBb4mhQFv8',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      metsValue: 2.2,
    },
    {
      name: 'Legs Up The Wall (Viparita Karani)',
      category: 'yoga',
      description: 'Restorative inversion that reduces cortisol and aids thyroid hormone regulation.',
      baseDuration: 10, sets: 1, reps: '10 min hold', baseCalories: 20, intensity: 'low',
      muscleGroups: ['core', 'hamstrings'],
      equipmentNeeded: ['yoga mat', 'wall'], notes: 'Perfect post-workout recovery pose.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['glaucoma'],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=NLu-F7EKs8w',
      imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0',
      metsValue: 1.2,
    },

    // ─── STRENGTH TRAINING ─────────────────────────────────────────────────────
    {
      name: 'Bodyweight Squats',
      category: 'strength',
      description: 'Compound lower-body exercise that builds quads, glutes and burns significant calories.',
      baseDuration: 15, sets: 4, reps: '4 × 15 reps', baseCalories: 90, intensity: 'medium',
      muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
      equipmentNeeded: ['none'], notes: 'Keep chest up; push knees out.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['knee injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155',
      metsValue: 5.0,
    },
    {
      name: 'Push-Ups',
      category: 'strength',
      description: 'Classic upper-body exercise targeting chest, triceps, and shoulders.',
      baseDuration: 12, sets: 4, reps: '4 × 12 reps', baseCalories: 70, intensity: 'medium',
      muscleGroups: ['chest', 'triceps', 'shoulders', 'core'],
      equipmentNeeded: ['none'], notes: 'Modify on knees if needed.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['wrist injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 4.0,
    },
    {
      name: 'Dumbbell Lunges',
      category: 'strength',
      description: 'Unilateral leg exercise that corrects muscle imbalances and burns fat.',
      baseDuration: 15, sets: 3, reps: '3 × 12 each leg', baseCalories: 100, intensity: 'medium',
      muscleGroups: ['quads', 'glutes', 'hamstrings', 'calves'],
      equipmentNeeded: ['dumbbells'], notes: 'Keep front knee over ankle.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['knee injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      metsValue: 5.5,
    },
    {
      name: 'Deadlift (Light Weight)',
      category: 'strength',
      description: 'Full-body posterior chain exercise that boosts metabolism for hours.',
      baseDuration: 15, sets: 3, reps: '3 × 10 reps', baseCalories: 110, intensity: 'high',
      muscleGroups: ['hamstrings', 'glutes', 'back', 'core', 'traps'],
      equipmentNeeded: ['barbell or dumbbells'], notes: 'Hinge at hips; keep back neutral.',
      suitableFor: ['gain', 'lose'],
      contraindications: ['lower back injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
      metsValue: 6.0,
    },
    {
      name: 'Plank',
      category: 'strength',
      description: 'Isometric core hold that builds stability and posture.',
      baseDuration: 10, sets: 3, reps: '3 × 60 sec', baseCalories: 45, intensity: 'medium',
      muscleGroups: ['core', 'shoulders', 'glutes'],
      equipmentNeeded: ['none'], notes: 'Squeeze glutes to protect lower back.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 3.5,
    },
    {
      name: 'Dumbbell Shoulder Press',
      category: 'strength',
      description: 'Overhead pressing movement for strong, defined shoulders.',
      baseDuration: 12, sets: 3, reps: '3 × 12 reps', baseCalories: 65, intensity: 'medium',
      muscleGroups: ['shoulders', 'triceps', 'upper chest'],
      equipmentNeeded: ['dumbbells'], notes: 'Avoid shrugging shoulders.',
      suitableFor: ['gain', 'maintain'],
      contraindications: ['shoulder injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
      imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      metsValue: 4.5,
    },
    {
      name: 'Bent-Over Dumbbell Rows',
      category: 'strength',
      description: 'Back-building exercise that improves posture and upper body strength.',
      baseDuration: 12, sets: 3, reps: '3 × 12 reps', baseCalories: 70, intensity: 'medium',
      muscleGroups: ['lats', 'rhomboids', 'biceps', 'rear delts'],
      equipmentNeeded: ['dumbbells'], notes: 'Pull elbows back, not out.',
      suitableFor: ['gain', 'maintain', 'lose'],
      contraindications: ['lower back injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
      metsValue: 4.5,
    },
    {
      name: 'Glute Bridges',
      category: 'strength',
      description: 'Targeted glute activation that also supports lower back health.',
      baseDuration: 12, sets: 3, reps: '3 × 20 reps', baseCalories: 55, intensity: 'low',
      muscleGroups: ['glutes', 'hamstrings', 'core'],
      equipmentNeeded: ['none'], notes: 'Squeeze at top for 2 seconds.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155',
      metsValue: 3.5,
    },
    {
      name: 'Tricep Dips',
      category: 'strength',
      description: 'Bodyweight exercise targeting triceps using chair or parallel bars.',
      baseDuration: 10, sets: 3, reps: '3 × 15 reps', baseCalories: 60, intensity: 'medium',
      muscleGroups: ['triceps', 'chest', 'shoulders'],
      equipmentNeeded: ['chair or parallel bars'], notes: 'Keep elbows close to body.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['shoulder injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=0326dy_-CzM',
      imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      metsValue: 4.0,
    },
    {
      name: 'Romanian Deadlift',
      category: 'strength',
      description: 'Hip-hinge movement that isolates hamstrings and glutes for posterior chain development.',
      baseDuration: 12, sets: 3, reps: '3 × 12 reps', baseCalories: 85, intensity: 'medium',
      muscleGroups: ['hamstrings', 'glutes', 'lower back'],
      equipmentNeeded: ['dumbbells or barbell'], notes: 'Feel hamstring stretch at bottom.',
      suitableFor: ['gain', 'lose'],
      contraindications: ['lower back injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
      metsValue: 5.5,
    },

    // ─── HIIT ──────────────────────────────────────────────────────────────────
    {
      name: 'Burpees',
      category: 'hiit',
      description: 'Explosive full-body movement that maximizes calorie burn and builds cardiovascular fitness.',
      baseDuration: 15, sets: 4, reps: '4 × 10 reps', baseCalories: 180, intensity: 'high',
      muscleGroups: ['full body'],
      equipmentNeeded: ['none'], notes: 'Modify by removing jump if needed.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['heart conditions', 'knee injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=auBLPXO8Fww',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      metsValue: 8.0,
    },
    {
      name: 'Mountain Climbers',
      category: 'hiit',
      description: 'Dynamic plank variation that builds core strength and spikes heart rate.',
      baseDuration: 12, sets: 4, reps: '4 × 30 sec', baseCalories: 120, intensity: 'high',
      muscleGroups: ['core', 'shoulders', 'hip flexors', 'quads'],
      equipmentNeeded: ['none'], notes: 'Keep hips level; don\'t bounce.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['wrist injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 8.0,
    },
    {
      name: 'Box Jumps',
      category: 'hiit',
      description: 'Plyometric movement for explosive power and rapid calorie expenditure.',
      baseDuration: 12, sets: 3, reps: '3 × 10 reps', baseCalories: 130, intensity: 'high',
      muscleGroups: ['quads', 'glutes', 'calves', 'core'],
      equipmentNeeded: ['plyo box or step'], notes: 'Land softly; step down, don\'t jump down.',
      suitableFor: ['lose', 'gain'],
      contraindications: ['knee injury', 'ankle injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=52r_Ul5k03g',
      imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
      metsValue: 8.0,
    },
    {
      name: 'Jumping Jacks',
      category: 'hiit',
      description: 'Classic warm-up and cardio exercise to quickly elevate heart rate.',
      baseDuration: 10, sets: 3, reps: '3 × 50 reps', baseCalories: 100, intensity: 'medium',
      muscleGroups: ['full body'],
      equipmentNeeded: ['none'], notes: 'Keep core engaged throughout.',
      suitableFor: ['lose', 'maintain', 'gain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
      imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3',
      metsValue: 8.0,
    },
    {
      name: 'Squat Jumps',
      category: 'hiit',
      description: 'Explosive squat variation that burns fat and builds power.',
      baseDuration: 10, sets: 4, reps: '4 × 15 reps', baseCalories: 140, intensity: 'high',
      muscleGroups: ['quads', 'glutes', 'calves'],
      equipmentNeeded: ['none'], notes: 'Sink deep before exploding up.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['knee injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=A-cFYWvaHr0',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 8.0,
    },
    {
      name: 'High Knees',
      category: 'hiit',
      description: 'Running in place with exaggerated knee drive for cardio and core conditioning.',
      baseDuration: 10, sets: 4, reps: '4 × 30 sec', baseCalories: 110, intensity: 'high',
      muscleGroups: ['hip flexors', 'core', 'quads', 'calves'],
      equipmentNeeded: ['none'], notes: 'Pump arms vigorously.',
      suitableFor: ['lose', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=TX5SoVVBQPE',
      imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3',
      metsValue: 8.0,
    },
    {
      name: 'Tabata Bodyweight Circuit',
      category: 'hiit',
      description: '8 rounds of 20s max effort / 10s rest using push-ups, squats, & mountain climbers.',
      baseDuration: 20, sets: 8, reps: '20s on / 10s off', baseCalories: 260, intensity: 'high',
      muscleGroups: ['full body'],
      equipmentNeeded: ['none'], notes: 'Use a Tabata timer app.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['heart conditions'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=MwSkIkJTLGU',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      metsValue: 9.0,
    },
    {
      name: 'Bear Crawls',
      category: 'hiit',
      description: 'Primal movement pattern that builds total-body strength and coordination.',
      baseDuration: 10, sets: 3, reps: '3 × 20 metres', baseCalories: 90, intensity: 'medium',
      muscleGroups: ['shoulders', 'core', 'quads', 'hip flexors'],
      equipmentNeeded: ['none'], notes: 'Keep back flat; knees hover 2 inches off ground.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['wrist injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=kMnSjSSwFxQ',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
      metsValue: 6.5,
    },
    {
      name: 'Battle Rope Slams',
      category: 'hiit',
      description: 'Upper-body power exercise using heavy ropes for metabolic conditioning.',
      baseDuration: 12, sets: 4, reps: '4 × 20 slams', baseCalories: 150, intensity: 'high',
      muscleGroups: ['shoulders', 'back', 'arms', 'core'],
      equipmentNeeded: ['battle ropes'], notes: 'Drive power from hips.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['shoulder injury'],
      timeOfDay: 'afternoon',
      videoUrl: 'https://www.youtube.com/watch?v=qSVr8Fqp8XY',
      imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      metsValue: 9.0,
    },
    {
      name: 'Sprint Pyramid',
      category: 'hiit',
      description: 'Progressive sprint intervals: 100m, 200m, 400m, 200m, 100m with equal rest.',
      baseDuration: 25, sets: 5, reps: '100-200-400-200-100m', baseCalories: 280, intensity: 'high',
      muscleGroups: ['full body'],
      equipmentNeeded: ['open space'], notes: 'Warm up 5 min jog before starting.',
      suitableFor: ['lose', 'maintain'],
      contraindications: ['heart conditions', 'thyroid uncontrolled'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=aaXvF0czZxE',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      metsValue: 12.0,
    },

    // ─── FLEXIBILITY / MOBILITY ────────────────────────────────────────────────
    {
      name: 'Standing Hamstring Stretch',
      category: 'flexibility',
      description: 'Essential stretch for reducing lower back pain and improving posterior chain flexibility.',
      baseDuration: 8, sets: 2, reps: '2 × 30 sec each side', baseCalories: 15, intensity: 'low',
      muscleGroups: ['hamstrings', 'calves'],
      equipmentNeeded: ['none'], notes: 'Hinge from hip, not waist.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=N3oQRSPoxLY',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 1.5,
    },
    {
      name: 'Hip Flexor Lunge Stretch',
      category: 'flexibility',
      description: 'Counters sitting posture by opening tight hip flexors.',
      baseDuration: 8, sets: 2, reps: '2 × 45 sec each side', baseCalories: 15, intensity: 'low',
      muscleGroups: ['hip flexors', 'quads'],
      equipmentNeeded: ['yoga mat'], notes: 'Tuck pelvis to deepen stretch.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=YlAHCcUMxLo',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      metsValue: 1.5,
    },
    {
      name: 'Pigeon Pose',
      category: 'flexibility',
      description: 'Deep hip opener that releases stored emotional tension and piriformis tightness.',
      baseDuration: 10, sets: 2, reps: '2 × 90 sec each side', baseCalories: 20, intensity: 'low',
      muscleGroups: ['glutes', 'piriformis', 'hip flexors'],
      equipmentNeeded: ['yoga mat'], notes: 'Use blocks if hips don\'t reach floor.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['hip replacement', 'knee injury'],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=MePse7ofYhg',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 1.5,
    },
    {
      name: 'Thoracic Spine Rotation',
      category: 'flexibility',
      description: 'Improves upper back mobility and reduces shoulder and neck pain.',
      baseDuration: 8, sets: 2, reps: '2 × 10 each side', baseCalories: 12, intensity: 'low',
      muscleGroups: ['thoracic spine', 'obliques', 'shoulders'],
      equipmentNeeded: ['yoga mat'], notes: 'Keep hips still; rotate only upper back.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=P8qSVzgE7iY',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      metsValue: 1.0,
    },
    {
      name: 'Ankle Circles & Calf Stretch',
      category: 'flexibility',
      description: 'Improves ankle mobility and reduces injury risk during workouts.',
      baseDuration: 5, sets: 2, reps: '2 × 15 rotations each foot', baseCalories: 8, intensity: 'low',
      muscleGroups: ['calves', 'ankles', 'achilles'],
      equipmentNeeded: ['none'], notes: 'Perform daily, especially after sitting.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=dGLnv4c8hfQ',
      imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb',
      metsValue: 1.0,
    },
    {
      name: 'Seated Spinal Twist',
      category: 'flexibility',
      description: 'Detoxifying twist that compresses and releases abdominal organs.',
      baseDuration: 8, sets: 2, reps: '2 × 45 sec each side', baseCalories: 12, intensity: 'low',
      muscleGroups: ['spine', 'obliques', 'hips'],
      equipmentNeeded: ['yoga mat'], notes: 'Lengthen spine before twisting.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=CbQOjLswgGE',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      metsValue: 1.0,
    },
    {
      name: 'Foam Rolling (IT Band & Quads)',
      category: 'flexibility',
      description: 'Self-myofascial release to reduce muscle soreness and improve recovery.',
      baseDuration: 12, sets: 1, reps: '3 min each area', baseCalories: 18, intensity: 'low',
      muscleGroups: ['IT band', 'quads', 'calves'],
      equipmentNeeded: ['foam roller'], notes: 'Pause on sore spots for 30 sec.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=OfKFOFb8c2Q',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 1.2,
    },
    {
      name: 'Doorway Chest Stretch',
      category: 'flexibility',
      description: 'Counteracts rounded shoulders from desk work by opening pecs.',
      baseDuration: 5, sets: 3, reps: '3 × 30 sec', baseCalories: 8, intensity: 'low',
      muscleGroups: ['chest', 'front shoulders', 'biceps'],
      equipmentNeeded: ['doorway'], notes: 'Stand in doorway with elbows at 90°.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: ['shoulder injury'],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=1ZBmVlFEsMs',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      metsValue: 1.0,
    },
    {
      name: 'Cat-Cow Stretch',
      category: 'flexibility',
      description: 'Gentle spinal mobilization that relieves back tension and improves posture.',
      baseDuration: 8, sets: 2, reps: '2 × 10 slow reps', baseCalories: 12, intensity: 'low',
      muscleGroups: ['spine', 'back extensors', 'abdominals'],
      equipmentNeeded: ['yoga mat'], notes: 'Sync breath with each movement.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'morning',
      videoUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      metsValue: 1.2,
    },
    {
      name: 'Wide-Leg Forward Fold',
      category: 'flexibility',
      description: 'Stretches inner thighs, hamstrings, and calms the nervous system.',
      baseDuration: 8, sets: 2, reps: '2 × 60 sec hold', baseCalories: 15, intensity: 'low',
      muscleGroups: ['inner thighs', 'hamstrings', 'lower back'],
      equipmentNeeded: ['yoga mat'], notes: 'Hinge from hips; use blocks if tight.',
      suitableFor: ['lose', 'gain', 'maintain'],
      contraindications: [],
      timeOfDay: 'evening',
      videoUrl: 'https://www.youtube.com/watch?v=9nVi-f4lYk8',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f',
      metsValue: 1.2,
    },
  ];

  private calculateAge(dob: string): number {
    return this.getAge(dob);
  }

  private selectAndCustomizeExercises(dto: CreateExerciseDto): ExerciseItem[] {
    const weight = parseFloat(dto.weight);
    const age = this.calculateAge(dto.dob);
    const goal = dto.weightGoalType;
    const health = (dto.healthIssue || '').toLowerCase();
    const activity = dto.activityLevel.toLowerCase();

    const isThyroid = health.includes('thyroid');
    const isSmoker = dto.lifestyle?.smoking === 'yes';
    const drinker = dto.lifestyle?.alcohol === 'yes';
    const bmi = dto.bmi;

    const categories = ['cardio', 'yoga', 'strength', 'hiit', 'flexibility'];
    const selected: ExerciseItem[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const adjustDuration = (base: number): number => {
      let d = base;
      if (activity === 'sedentary') d *= 0.7;
      else if (activity === 'light') d *= 0.85;
      else if (activity === 'active') d *= 1.1;
      else if (activity === 'very active') d *= 1.2;
      if (age > 50) d *= 0.9;
      if (bmi > 30) d *= 0.85;
      return Math.round(d);
    };

    const adjustCalories = (base: number, mets: number): number => {
      // Harris-Benedict: calories = MET × weight(kg) × duration(hrs)
      const durationHrs = adjustDuration(base) / 60;
      return Math.round(mets * weight * durationHrs);
    };

    const isContraindicated = (ex: ExerciseTemplate): boolean => {
      if (!ex.contraindications) return false;
      return ex.contraindications.some(c => {
        const cl = c.toLowerCase();
        if (isThyroid && cl.includes('thyroid') && cl.includes('uncontrolled')) return bmi > 30;
        if (bmi > 35 && cl.includes('knee')) return ex.intensity === 'high';
        return false;
      });
    };

    let dayIdx = 0;
    for (const category of categories) {
      const pool = this.exerciseLibrary.filter(
        e => e.category === category && !isContraindicated(e),
      );

      // Apply goal-based sorting
      pool.sort((a, b) => {
        const aMatch = a.suitableFor.includes(goal) ? -1 : 1;
        const bMatch = b.suitableFor.includes(goal) ? -1 : 1;
        // Thyroid: prefer yoga shoulder stand, fish pose, bridge
        if (isThyroid && category === 'yoga') {
          const thyroidBoost = ['Shoulder Stand (Sarvangasana)', 'Fish Pose (Matsyasana)', 'Boat Pose (Navasana)', 'Bridge Pose (Setu Bandhasana)'];
          const aBoost = thyroidBoost.includes(a.name) ? -2 : 0;
          const bBoost = thyroidBoost.includes(b.name) ? -2 : 0;
          return aMatch + aBoost - (bMatch + bBoost);
        }
        return aMatch - bMatch;
      });

      // Pick 10 per category
      const picked = pool.slice(0, 10);

      picked.forEach((ex, i) => {
        const duration = adjustDuration(ex.baseDuration);
        const calories = adjustCalories(ex.baseDuration, ex.metsValue);
        const day = days[dayIdx % 7];
        dayIdx++;

        // Adjust intensity for high BMI or older age
        let intensity = ex.intensity;
        if ((bmi > 30 || age > 55) && intensity === 'high') intensity = 'medium';

        selected.push({
          id: uuidv4(),
          name: ex.name,
          category: ex.category,
          description: ex.description,
          duration,
          sets: ex.sets,
          reps: ex.reps,
          caloriesBurned: calories,
          intensity,
          muscleGroups: ex.muscleGroups,
          equipmentNeeded: ex.equipmentNeeded,
          notes: this.buildPersonalizedNote(ex, dto, age, isThyroid, isSmoker),
          suitableFor: ex.suitableFor,
          contraindications: ex.contraindications,
          dayOfWeek: day,
          timeOfDay: ex.timeOfDay,
          videoUrl: ex.videoUrl,
          imageUrl: ex.imageUrl,
          metsValue: ex.metsValue,
        });
      });
    }

    return selected;
  }

  private buildPersonalizedNote(
    ex: ExerciseTemplate,
    dto: CreateExerciseDto,
    age: number,
    isThyroid: boolean,
    isSmoker: boolean,
  ): string {
    let note = ex.notes;
    if (isThyroid && ex.category === 'yoga') {
      note += ' Thyroid-supportive: hold 2 extra breaths.';
    }
    if (isSmoker && ex.category === 'cardio') {
      note += ' Build pace gradually; monitor breathing.';
    }
    if (age > 50) {
      note += ' Rest 90 sec between sets.';
    }
    if (dto.weightGoalType === 'lose' && ex.intensity === 'high') {
      note += ' Maintain 70-80% max heart rate for fat burn zone.';
    }
    return note;
  }

  private generateNutritionTips(dto: CreateExerciseDto): string[] {
    const tips: string[] = [];
    const isVeg = dto.diet.toLowerCase().includes('veg') && !dto.diet.toLowerCase().includes('non');
    const goal = dto.weightGoalType;

    if (goal === 'lose') {
      tips.push(`Target ${dto.caloriesRequired} kcal/day — a ~500 kcal deficit from your TDEE of ${dto.tdee}.`);
      tips.push('Eat high-volume, low-calorie foods: leafy greens, cucumber, broth soups.');
    } else if (goal === 'gain') {
      tips.push(`Eat ${dto.tdee + 300} kcal/day for lean muscle gain.`);
      tips.push('Consume 1.6–2.2g protein per kg of bodyweight daily.');
    } else {
      tips.push(`Maintain ~${dto.caloriesRequired} kcal/day to preserve current weight.`);
    }

    if (!isVeg) {
      tips.push('Include chicken breast, eggs, and fish 4-5x/week for complete amino acid profile.');
    } else {
      tips.push('Combine legumes + whole grains for complete plant protein.');
    }

    if (dto.healthIssue?.toLowerCase().includes('thyroid')) {
      tips.push('Avoid raw cruciferous vegetables (broccoli, cabbage) in large amounts — they may suppress thyroid.');
      tips.push('Eat selenium-rich foods: Brazil nuts (2/day), sunflower seeds, brown rice.');
      tips.push('Limit soy products as they can interfere with thyroid hormone absorption.');
      tips.push('Take thyroid medication 30-60 min before breakfast on an empty stomach.');
    }

    tips.push('Drink 3-4L of water daily. Add lemon for metabolism boost.');
    tips.push('Avoid processed sugar and refined carbs — they spike insulin and promote fat storage.');

    return tips;
  }

  private generateGeneralTips(dto: CreateExerciseDto): string[] {
    const tips: string[] = [
      'Sleep 7-9 hours nightly — growth hormone is released during deep sleep.',
      'Do not skip the warm-up; 5 min light cardio prevents injury.',
      'Track your workouts in a journal to monitor progress.',
    ];

    if (dto.lifestyle?.smoking === 'yes') {
      tips.push('Quitting smoking will significantly improve your VO2 max and exercise capacity within 2 weeks.');
    }
    if (dto.lifestyle?.alcohol === 'yes') {
      tips.push('Limit alcohol to weekends — it disrupts sleep, increases cortisol, and impairs fat metabolism.');
    }
    if (dto.weightGoalType === 'lose') {
      tips.push('Walk at least 8,000 steps daily outside of your workout for additional NEAT calories.');
    }
    if (dto.healthIssue?.toLowerCase().includes('thyroid')) {
      tips.push('Avoid exercising within 1 hour of taking thyroid medication.');
      tips.push('Monitor resting heart rate — thyroid issues can cause elevated resting HR during high-intensity exercise.');
    }

    return tips;
  }

  async generateExercisePlan(dto: CreateExerciseDto): Promise<ExercisePlan> {
    const exercises = this.selectAndCustomizeExercises(dto);
    const totalCalories = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

    const schedule: Record<string, string[]> = {};
    exercises.forEach(e => {
      if (!schedule[e.dayOfWeek]) schedule[e.dayOfWeek] = [];
      schedule[e.dayOfWeek].push(`${e.name} (${e.category})`);
    });
    const weeklySchedule = Object.entries(schedule)
      .map(([day, exs]) => `${day}: ${exs.join(', ')}`)
      .join(' | ');

    const planSummary =
      `Personalized 7-day plan for ${dto.name} (${this.getAge(dto.dob)}y, BMI ${dto.bmi}). ` +
      `Goal: ${dto.weightGoalType} ${dto.weightGoalAmount}kg. ` +
      `50 exercises across Cardio, Yoga, Strength, HIIT, Flexibility. ` +
      `Estimated weekly calorie burn: ${totalCalories} kcal.` +
      (dto.healthIssue ? ` Tailored for: ${dto.healthIssue}.` : '');

    const plan = new this.exercisePlanModel({
      userId: uuidv4(),
      ...dto,
      exercises,
      totalWeeklyCaloriesBurned: totalCalories,
      planSummary,
      weeklySchedule,
      nutritionTips: this.generateNutritionTips(dto),
      generalTips: this.generateGeneralTips(dto),
    });

    return plan.save();
  }

  async getAllPlans(): Promise<ExercisePlan[]> {
    return this.exercisePlanModel.find().exec();
  }

  async getPlanById(id: string): Promise<ExercisePlan | null> {
    return this.exercisePlanModel.findById(id).exec();
  }
}
