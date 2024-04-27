export interface IBuildProjectItem {
  id: number;
  projectId: number;
  unitProject: string;
  uuid: string;
  motor3dId: string;
}
export interface IMathchMemberConfig {
  computeProjectDtos: ComputeProjectDto[];
  concreteLevelDtos: ConcreteLevelDto[];
  memberTypeDtos: MemberTypeDto[];
  rebarCodeDtos: RebarCodeDto[];
  rebarTypeDtos: RebarTypeDto[];
}

export interface ComputeProjectDto {
  computeProject: string;
  id: number;
}

export interface ConcreteLevelDto {
  concreteLevel: string;
  id: number;
}

export interface MemberTypeDto {
  id: number;
  memberType: string;
}

export interface RebarCodeDto {
  id: number;
  rebarCode: string;
}

export interface RebarTypeDto {
  id: number;
  rebarType: number;
}
