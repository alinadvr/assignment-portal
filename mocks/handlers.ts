import { http, HttpResponse } from "msw";

// Define the mock API call to return the levels.
export const handlers = [
  http.get("https://tools.qa.public.ale.ai/api/tools/candidates/levels", () => {
    return HttpResponse.json({
      levels: ["Junior", "Middle", "Senior"],
    });
  }),
  http.post(
    "https://tools.qa.public.ale.ai/api/tools/candidates/assignments",
    async ({ request }) => {
      const body = (await request.json()) as null | {
        name?: string;
        email?: string;
        assignment_description?: string;
        github_repo_url?: string;
        candidate_level?: string;
      };

      if (
        !body ||
        !body.name ||
        !body.email ||
        !body.assignment_description ||
        body.assignment_description.length < 10 ||
        !body.github_repo_url ||
        !body.candidate_level
      )
        return HttpResponse.json(null, { status: 401 });

      return HttpResponse.json(null, { status: 200 });
    },
  ),
];
