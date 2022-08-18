import { Box, List, Drawer, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Inbox, Mail } from '@mui/icons-material'
import { path } from 'utils/path'
import Link from 'next/link'

type Props = {
  open: boolean
  onClose: () => void
}

export const DrawerMenu = (props: Props) => {
  const menuItems = [
    { text: 'components', link: path.components },
    { text: 'menu1', link: path.home },
    { text: 'menu2', link: path.home },
    { text: 'menu3', link: path.home }
  ]

  return (
    <Drawer open={props.open} onClose={props.onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={props.onClose}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <Link href={item.link}>
                <ListItemText primary={item.text} />
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}
