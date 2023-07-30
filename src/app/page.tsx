"use client";
import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Main.module.css";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import { Data } from "./data";
import CircularProgress from "@mui/material/CircularProgress";
import SpeedDial from "@mui/material/SpeedDial";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { getAccessToken } from "./auth/auth";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Home() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "title", headerName: "Аннотация", width: 500 },
    { field: "description", headerName: "Описание", width: 900 },
    { field: "prc", headerName: "Точность", width: 150 },
  ];

  const [tags, SetTags] = useState<String[]>([]);
  const [tag, SetTag] = useState<String>("");
  const [inp, SetInp] = useState<String>("");
  const [tag_st, SetTag_St] = useState<number>(100);
  const [data, SetData] = useState<Data[]>([]);
  const [load, SetLoad] = useState(false);
  const [load1, SetLoad1] = useState(false);
  const API_BASE_URL = "http://127.0.0.1:5000"; // Замените на URL вашего Flask-бекенда

  function handleClick() {}
  useEffect(() => {
    fetchData();
    setTimeout(() => {
      SetLoad1(true);
    }, 100);
  }, []);

  function handleDelete(param) {
    console.log(param);
    var array = [...tags]; // make a separate copy of the array
    var index = tags.indexOf(param);
    if (index !== -1) {
      array.splice(index, 1);
      SetTags([...array]);
    }
  }

  const fetchData = async () => {
    const accessToken = getAccessToken();
    try {
      const response = await axios.get("http://127.0.0.1:5000/data", {
        params: {
          inp: inp,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Путь к вашему Flask API
      console.log(response.data);
      SetData(response.data);
      SetLoad(true);
    } catch (error) {
      console.error(error);
    }
  };
  // data: data.map((item) => ({ id: item.id, value: item.prc, lable: item.title }))

  const changeValue = (event, value) => {
    SetTag_St(value);
  };
  const size = {
    width: 400,
    height: 200,
  };
  const fetchDataTags = async () => {
    const accessToken = getAccessToken();
    try {
      console.log(tags);
      const response = await axios.get("http://127.0.0.1:5000/data/tags", {
        params: {
          inp: inp,
          tags: tags.join("||"),
          tag_st: tag_st,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Путь к вашему Flask API
      console.log(response.data);
      SetData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {load1 ? (
        <div>
          <div>
            <div className={styles.bar}>
              <TextField
                value={inp}
                onChange={(e) => {
                  SetInp(e.target.value);
                }}
                id="outlined-basic"
                className={styles.bar_inp}
                label="Поиск"
                variant="outlined"
              />
              <Button
                onClick={(e) => {
                  if (tags.length < 1) {
                    fetchData();
                  } else {
                    fetchDataTags();
                  }
                }}
                variant="contained"
              >
                Поиск
              </Button>
              <TextField
                value={tag}
                className={styles.bar_inp}
                onChange={(e) => {
                  SetTag(e.target.value);
                }}
                id="outlined-basic"
                label="Теги"
                variant="outlined"
              />
              <Button
                title="Положительный тег"
                onClick={(e) => {
                  if (tag.length > 0) {
                    SetTags([...tags, "+" + tag]);
                    SetTag("");
                  }
                }}
                variant="contained"
              >
                +
              </Button>
              <Button
                title="Негативный тег"
                onClick={(e) => {
                  if (tag.length > 0) {
                    SetTags([...tags, "-" + tag]);
                    SetTag("");
                  }
                }}
                variant="contained"
              >
                -
              </Button>
              <Stack sx={{ height: 60 }} spacing={1} direction="row">
                <Slider
                  aria-label="Temperature"
                  orientation="vertical"
                  value={tag_st}
                  valueLabelDisplay="auto"
                  onChange={changeValue}
                />
              </Stack>
            </div>
            {load ? (
              <div>
                <div className={styles.tag}>
                  {tags.map((tag) => (
                    <Chip
                      label={tag}
                      variant="outlined"
                      onClick={handleClick}
                      onDelete={() => handleDelete(tag)}
                    />
                  ))}
                </div>
                <div className={styles.row_gr}>
                  {" "}
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: data.map((value) => value.title),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: data.map((value) => value.prc),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                  <PieChart
                    series={[
                      {
                        arcLabel: (item) => `${item.title} (${item.prc})`,
                        arcLabelMinAngle: 45,
                        data,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontWeight: "bold",
                      },
                    }}
                    {...size}
                  />
                </div>
                <DataGrid
                  columns={columns}
                  rows={data}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 15 },
                    },
                  }}
                  pageSizeOptions={[5, 15, 20, 25, 30]}
                  slots={{ toolbar: GridToolbar }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          {!load ? (
            <div className={styles.load}>
              <CircularProgress />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      <Link href="/auth">
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<AccountCircleIcon />}
        ></SpeedDial>
      </Link>
    </div>
  );
}
