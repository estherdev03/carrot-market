import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const saveSession = async (user: { id: number }) => {
  const session = await getSession();
  session.id = user.id;
  await session.save();
};

const getAccessToken = async (code: string): Promise<any> => {
  const accessTokenUrl = "https://github.com/login/oauth/access_token";
  const formattedParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const finalUrl = `${accessTokenUrl}?${formattedParams}`;
  const accessTokenResponse = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  return accessTokenResponse.json();
};

const getGithubProfile = async (access_token: string): Promise<any> => {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return userProfileResponse.json();
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const { id, avatar_url, login } = await getGithubProfile(access_token);
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: { id: true },
  });
  if (user) {
    await saveSession(user);
    return redirect("/profile");
  }

  //Check if username already exists
  const isExistUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  const newUser = await db.user.create({
    data: {
      username: Boolean(isExistUsername) ? login + "_gh" : login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await saveSession(newUser);
  return redirect("/profile");
}
