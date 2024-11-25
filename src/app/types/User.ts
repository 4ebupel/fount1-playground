import { BaseUser } from "./BaseUser";
import { CandidateProfile } from "./CandidateProfile";
import { EmployerProfile } from "./EmployerProfile";
import { VerifierProfile } from "./VerifierProfile";

export interface User extends BaseUser {
    employer_profile?: EmployerProfile;
    candidate_profile?: CandidateProfile;
    verifier_profile?: VerifierProfile;
}
