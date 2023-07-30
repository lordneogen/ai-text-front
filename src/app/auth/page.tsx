"use client";

import Image from "next/image";
import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Main.module.css";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { ClassNames } from "@emotion/react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { redirect } from "next/navigation";
import Link from "next/link";
import { login } from "./auth";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");

  return (
    <div className={styles.auth}>
      <h3>Регистрация</h3>
      <p>Имя/Фамилия</p>
      <TextField
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        label="Имя/Фамилия"
      ></TextField>
      <p>Пароль</p>
      <TextField
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        label="Пароль"
        type="password"
        autoComplete="current-password"
      ></TextField>
      <div>
        <Button onClick={() => login(username, password)} variant="contained">
          Зарегестрироваться
        </Button>
        <Link href="/">
          <Button variant="contained" className={styles.mrg}>
            Назад
          </Button>
        </Link>
      </div>
    </div>
  );
}
