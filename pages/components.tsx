import Head from 'next/head'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { ReactNode, SyntheticEvent, useState } from 'react'
import { useAlert } from 'hooks/AlertHook'
import { useConfirm } from 'hooks/ConfirmHook'
import { Info, QuestionAnswer } from '@mui/icons-material'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const Components = () => {
  const [tabNum, setTabNum] = useState(0)
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()

  const handleChangeTabNum = (_event: SyntheticEvent, newTabNum: number) => {
    setTabNum(newTabNum)
  }

  return (
    <>
      <Head>
        <title>components</title>
      </Head>
      <h1>components</h1>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
        <Tabs
          value={tabNum}
          onChange={handleChangeTabNum}
          variant="scrollable"
          aria-label="scrollable auto tabs example"
          orientation="vertical"
          sx={{ borderRight: 1, borderColor: 'divider' }}
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab label="Dialogs" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={tabNum} index={0}>
          <h1>Dialogs</h1>
          <Box>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={async () => {
                await openAlertDialog('Alert', 'Text')
              }}
              startIcon={<Info />}
            >
              Alert
            </Button>
          </Box>
          <Box sx={{ marginTop: 1 }}>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              onClick={async () => {
                await openConfirmDialog('Comfirm', 'Text')
              }}
              startIcon={<QuestionAnswer />}
            >
              Confirm
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={tabNum} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabNum} index={2}>
          Item Three
        </TabPanel>
      </Box>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )
}

export default Components
