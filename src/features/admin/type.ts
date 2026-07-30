export interface RitualsSchema {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  name: string;
  timeOfExecution?: string;
  dateLunar: string;
  dateSolar?: string;
  difficultyLevel: "Dễ" | "TB" | "Khó" | "Rất khó";
  description?: string;
  content?: string;
  reference?: string;
  isHot: boolean;
  ritualCategoryId?: string;
  ritualMedias?: [];
  ritualTags?: [];
  prayer?: [];
}
